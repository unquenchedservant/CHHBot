const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const config = require('../../utility/config');

const data = new SlashCommandBuilder()
    .setName('testpingannouncements')
    .setDescription('Have the bot ping announcements channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

module.exports = {
    data,
    async execute(interaction){
        const annch = interaction.client.channels.fetch(config.get_announcements_channel_id());
        await annch.send(`This is a test, sorry`);
    }
}