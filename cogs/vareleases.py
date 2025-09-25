import discord
from discord.commands import (slash_command)
from discord.commands import Option
from discord import option
from discord.ext import commands
from discord import SlashCommandGroup
from db.va_releases import VAReleasesDB
from utilities.logging import logger
import utilities
from utilities import Config

class VAReleases(commands.Cog):
    vareleasesgrp = SlashCommandGroup(name="release", description="Verified Artist Releases")     

    def __init__(self, bot):
        self.bot = bot
        self.va_releases_db = VAReleasesDB()
        self.config = Config()
    
    def check_verified(self, user):
        return any(role.name == "Verified Artist" for role in user.roles)

    def build_announcement_embed(self, embedTitle, msg, title, releaseDate, desc, link, type):
        embed = discord.Embed(title = embedTitle)
        embed.description = msg
        embed.add_field(name="Title", value=title)
        embed.add_field(name="Release Date", value=releaseDate)
        embed.add_field(name="Description", value=desc)
        embed.add_field(name="Type", value=type)
        embed.add_field(name="Link", value=f"[Link]({link})" if not link == "None" else "None")
        return embed

    @vareleasesgrp.command(description="Add a release (most fields can be updated later)")
    async def add(self, ctx: discord.ApplicationContext,
                  title: Option(str, description="Title of the project", required=True), #type:ignore
                  type: Option(str, choices=["Album", "Single", "Mixtape", "EP"], required=True), #type:ignore
                  release_date: Option(str, description="Format: MM/DD/YY, default: TBA", default="TBA", required=False), #type:ignore
                  desc: Option(str, description="Gives us a short description(<300 characters) of the release. Default: Blank", default="", required=False), #type:ignore
                  link: Option(str, description="Provide a distro link to the release (song.link, etc), default: None", default="None", required=False)): #type:ignore
        userID = ctx.author.id
        userName = utilities.get_username(ctx.author)
        logger.info(f"{userName} added a new {type} release, releasing: {release_date}")
        id = self.va_releases_db.add(userID, userName, title, release_date, desc, type, link)
        await ctx.respond(f"Successfully added that release, ID #{id}. Please use this ID to update or delete your release at any time", ephemeral=True)
        embed = self.build_announcement_embed("New Release Added", f"<@{userID}> announced a new release!", title, release_date, desc, link, type)
        ann_ch = self.bot.get_channel(self.config.get_announcements_channel_id())
        await ann_ch.send(embed=embed)
    
    @vareleasesgrp.command(description="Update a release (Only update the fields you need to update)")
    async def update(self, ctx: discord.ApplicationContext,
                     id: Option(int, description="Please provide the ID of the release", required=True), #type:ignore
                     title: Option(str, description="Update the title of the release", default="", required=False), #type:ignore
                     release_date: Option(str, description="Format: MM/DD/YY, default: TBA", default="", required=False), #type:ignore
                     type: Option(str, choices=["-", "Album", "Single", "Mixtape", "EP"], default="-", required=False), #type:ignore
                     desc: Option(str, description="Update the description", default="", required=False), #type:ignore
                     link: Option(str, description="Update the link, default: None", default="", required=False)): #type:ignore
        if type == "-":
            type = ""
        if self.va_releases_db.check(id) ==  0:
            logger.info(f"{utilities.get_username(ctx.author)} tried to update a release that didn't exist")
            await ctx.respond("That release does not exist", ephemeral=True)
            return
        release_id = self.va_releases_db.get_user_by_id(id)[0][0]
        if not release_id == ctx.author.id:
            logger.info(f"{utilities.get_username(ctx.author)} tried to update a release that wasn't theirs")
            await ctx.respond("That release is not yours", ephemeral=True)
            return
        self.va_releases_db.update(id, title, release_date, desc, type, link)
        logger.info(f"{utilities.get_username(ctx.author)} successfully updated release ID #{id}")
        await ctx.respond(f"Successfully updated release ID #{id}. Use `/release check` to verify", ephemeral=True)
        release = self.va_releases_db.get_by_id(id)[0] # we can safely assume at this point that this will return 1 result
        embed = self.build_announcement_embed("Updated Release", f"<@{ctx.author.id}> updated an upcoming release", release[3], release[4], release[5], release[7], release[6])
        ann_ch = self.bot.get_channel(self.config.get_announcements_channel_id())
        await ann_ch.send(embed=embed)
    
    @vareleasesgrp.command(description="Remove a release by ID")
    async def remove(self, ctx: discord.ApplicationContext, 
                     id: Option(int, description="Please provide the ID of the release you want to remove", required=True)): #type:ignore
        uname = utilities.get_username(ctx.author)
        if self.va_releases_db.check(id) == 0:
            logger.info(f"{uname} tried to delete a release that didn't exist")
            await ctx.respond("That release does not exist", ephemeral=True)
            return
        release_id = self.va_releases_db.get_user_by_id(id)[0][0]
        if not release_id == ctx.author.id:
            logger.info(f"{uname} tried to delete a release that wasn't theirs")
            await ctx.respond("That release is not yours", ephemeral=True)
            return
        release = self.va_releases_db.get_by_id(id)[0]
        print(release)
        self.va_releases_db.delete(id)
        await ctx.respond(f"Successfully deleted release #{id}", ephemeral=True)
        embed = self.build_announcement_embed("Cancelled Release", f"<@{ctx.author.id}> removed an upcoming release", release[3], release[4], release[5], release[7], release[6])
        ann_ch = self.bot.get_channel(self.config.get_announcements_channel_id())
        await ann_ch.send(embed=embed)

    @vareleasesgrp.command(description="Check any artists release!")
    async def check(self, ctx: discord.ApplicationContext,
                    artist: Option(discord.User, default="", required=False)): #type:ignore
        is_self = False
        if artist == "":
            artist = ctx.author
            is_self = True

        releases = self.va_releases_db.get_by_user(artist.id)

        embed = discord.Embed(title=f"{utilities.get_username(artist)}'s Releases", color=discord.Color.green())
    
        if not releases:
            desc_msg = "No releases found"
            if self.check_verified(ctx.author) and is_self:
                desc_msg = desc_msg + ". Feel free to add one using `/release add`"
            embed.description = desc_msg
        else:
            for release in releases:
                release_id, _, _, title, date, desc, type_, link = release
                link_text = f"[Link]({link})" if link != "None" else "None"
                
                field_value = f"**Release Date:** {date}\n**Type:** {type_}\n**Description:** {desc}\n**Link:** {link_text}"
                name_field = f"ID #{release_id} - {title}" if self.check_verified(ctx.author) and is_self else f"{title}"
                embed.add_field(name=name_field, value=field_value, inline=False)

        await ctx.respond(embed=embed, ephemeral=True)


def setup(bot):
    bot.add_cog(VAReleases(bot))