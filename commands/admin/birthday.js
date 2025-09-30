const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const BirthdayDB = require('../../db/birthday');
const logger = require('../../utility/logger');

const birthday_db = new BirthdayDB();

const data = new SlashCommandBuilder()
	.setName('checkbirthday')
	.setDescription('check any user to see if they have a birthday set')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('User to check')
			.setRequired(true),
	);

module.exports = {
	data,
	async execute(interaction) {
		logger.info(`'/checkbirthday' was called by ${interaction.user.tag}`);
		const birthday = await birthday_db.get(interaction.options.getUser('user').id);
		if (birthday[0] == 0) {
			await interaction.reply({ content: 'User does not have a birthday set', flags: MessageFlags.Ephemeral });
		}
		else {
			await interaction.reply({ content: `${interaction.options.getUser('user').tag}'s birthday is set to ${birthday.MONTH}/${birthday.DAY}`, flags: MessageFlags.Ephemeral });
		}
	},
};