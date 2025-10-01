const { Events } = require('discord.js');
const logger = require('../utility/logger');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isChatInputCommand() && !interaction.isMessageContextMenuCommand()) return;

	    const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			logger.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
			else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};