const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const RoleMemoryDB = require('../../db/holiday');

const rolememory_db = new RoleMemoryDB();

const data = new SlashCommandBuilder()
     .setName('rolememory')
     .setDescription("Role Memory related settings")
     .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
     .addSubcommand(subcommand => 
        subcommand
        .setName("toggle")
        .setDescription("Toggle Role Memory on/off")
     )
     .addSubcommand(subcommand =>
        subcommand
        .setName("check")
        .setDescription("Check the current state of Role Memory")
     )

module.exports = {
    data,
    async execute(interaction){
        if (interaction.options.getSubcommand() === "toggle"){
            let status = await rolememory_db.check(interaction.guildId)
            let msg = status == 1
            ? "Role memory has been turned off for this server"
            : "Role memory has been turned on for this server"
            await rolememory_db.toggle(interaction.guildId)
            await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral })
        }else if(interaction.options.getSubcommand() === "check"){
            let status = await rolememory_db.check(interaction.guildId)
            let msg = status == 1
            ? "Role memory is turned on on this server"
            : "Role memory is turned off on this server"
            await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral})
        }
    }
}