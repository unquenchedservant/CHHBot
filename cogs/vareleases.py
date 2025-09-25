import discord
from discord.commands import (slash_command)
from discord.commands import Option
from discord import option
from discord.ext import commands
from discord import SlashCommandGroup
from db.va_releases import VAReleasesDB
from utilities.logging import logger
import utilities

class VAReleases(commands.Cog):
    vareleasesgrp = SlashCommandGroup(name="release", description="Verified Artist Releases")     

    def __init__(self, bot):
        self.bot = bot
        self.va_releases_db = VAReleasesDB()

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
        await ctx.respond(f"Successfully updated release ID #{id}. Use `/releases check` to verify", ephemeral=True)

    @vareleasesgrp.command(description="Remove a release by ID")
    async def remove(self, ctx: discord.ApplicationContext, 
                     id: Option(int, description="Please provide the ID of the release you want to remove", required=True)): #type:ignore
        uname = utilities.get_username(ctx.author)
        if self.va_releases_db.check(id) == 0:
            logger.info(f"{uname} tried to delete a release that didn't exist")
            await ctx.respond("That release does not exist", ephemeral=True)
            return
        release_id = self.va_releases_db.get_user_by_id(id)
        if not release_id == ctx.author.id:
            logger.info(f"{uname} tried to delete a release that wasn't theirs")
            await ctx.respond("That release is not yours", ephemeral=True)
            return
        self.va_releases_db.delete(id)
        await ctx.respond(f"Successfully deleted release #{id}", ephemeral=True)

    @vareleasesgrp.command(description="Check any artists release!")
    async def check(self, ctx: discord.ApplicationContext,
                    artist: Option(discord.User, default="", required=False)): #type:ignore
        if artist == "":
            artist = ctx.author
        releases = self.va_releases_db.get_by_user(artist.id)

        embed = discord.Embed(title=f"{utilities.get_username(artist)}'s Releases", color=discord.Color.green())
    
        if not releases:
            embed.description = "No releases found"
        else:
            for release in releases:
                release_id, _, _, title, date, desc, type_, link = release
                link_text = f"[Click here]({link})" if link != "None" else "No link"
                
                field_value = f"**Release Date:** {date}\n**Type:** {type_}\n**Description:** {desc}\n**Link:** {link_text}"
                embed.add_field(name=f"ID #{release_id} - {title}", value=field_value, inline=False)

        await ctx.respond(embed=embed, ephemeral=True)


def setup(bot):
    bot.add_cog(VAReleases(bot))