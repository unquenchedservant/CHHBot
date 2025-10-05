const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const ArchivalDB = require('../../db/archival');
const { checkMonth } = require('../../utility/dateutils');
const archival_db = new ArchivalDB();
const logger = require('../../utility/logger');
const config = require('../../utility/config');

const data = new SlashCommandBuilder()
	.setName('archive')
	.setDescription('Archival related settings')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
	.addSubcommand(subcommand =>
		subcommand
			.setName('add')
			.setDescription('Add or update a channel for archiving')
			.addChannelOption(option =>
				option
					.setName('channel')
					.setDescription('Channel to be archived')
					.setRequired(true),
			)
			.addIntegerOption(option =>
				option
					.setName('level')
					.setDescription('The level to archive (1 - server can view 2 - only mods can view')
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(2),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('remove')
			.setDescription('Remove a channel from the archives')
			.addChannelOption(option =>
				option
					.setName('channel')
					.setDescription('Channel to be removed from archives')
					.setRequired(true),
			),
	);

async function handle_existing_archive(channel, level, check) {
	if (check[0][3] == 2 && level == 1) {
		const current_month = checkMonth(new Date().getMonth() + 7);
		await archival_db.update(channel, { level, month: current_month });
	}
	else {
		await archival_db.update(channel, level);
	}
}

async function handle_new_archive(channel, level) {
	let current_month = new Date().getMonth() + 1;
	const current_day = new Date().getDay() + 1;
	if (level == 2) {
		current_month = checkMonth(current_month - 3);
	}
	await archival_db.set(channel, current_month, current_day, level);
}

async function channel_move(channel, level, guild) {
	const new_category_id = level == 1
		? config.get_archive_1_id()
		: config.get_archive_2_id();
	const category = guild.channels.cache.get(new_category_id);
	logger.info(`Moving channel ${channel.name} to category id #${new_category_id}`);
	await channel.setParent(category, {
		lockPermissions: true,
		position: 0,
	});
}

module.exports = {
	data,
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			logger.info(`'/archive add' was called by ${interaction.user.tag}`);
			const check = archival_db.check(interaction.options.getChannel('channel').id);
			if (check.length > 0) {
				if (check[0][3] === interaction.options.getInteger('level')) {
					logger.info('\'/archive add\' was unsuccessfuly');
					await interaction.reply({ content: 'That channel has already been set to be archived at that level.', flags: MessageFlags.Ephemeral });
				}
				else {
					await handle_existing_archive(interaction.options.getChannel('channel').id, interaction.options.getInteger('level'), check);
					await channel_move(interaction.options.getChannel('channel'), interaction.options.getInteger('level'), interaction.guild);
					await interaction.reply({ content: `Successfully updated archive level of ${interaction.options.getChannel('channel').name} to ${interaction.options.getInteger('level')}` });
					logger.info(`'/archive add' was successful. Archive update for ${interaction.options.getChannel('channel').name}`);
				}
			}
			else {
				await handle_new_archive(interaction.options.getChannel('channel').id, interaction.options.getInteger('level'));
				await channel_move(interaction.options.getChannel('channel'), interaction.options.getInteger('level'), interaction.guild);
				await interaction.reply({ content: `Successfully archived ${interaction.options.getChannel('channel').name} to ${interaction.options.getInteger('level')}`, flags: MessageFlags.Ephemeral });
				logger.info(`'/archive add' was successful. Added ${interaction.options.getChannel('channel').name} to the archive`);
			}
		}
		else if (interaction.options.getSubcommand() === 'remove') {
			logger.info(`'/archive remove' was called by ${interaction.user.tag}`);
			const check = archival_db.check(interaction.options.getChannel('channel').id);
			if (check.length > 0) {
				await archival_db.remove(interaction.options.getChannel('channel').id);
				await interaction.reply({ content: `Successfully removed ${interaction.options.getChannel('channel').name} from the DB, please move it manually and sync permissions if applicable` });
				logger.info(`'/archive remove' was successful. ${interaction.options.getChannel('channel').name} has been removed from the archives. Ensure it was moved properly.`);
			}
			else {
				await interaction.reply({ content: 'That channel is not set to be archived.', flags: MessageFlags.Ephemeral });
				logger.info(`'/archive remove' was unsuccessful. ${interaction.options.getChannel('channel').name} is not set to be archived.`);
			}
		}
	},
};