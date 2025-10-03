const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const VAReleasesDB = require('../../db/vareleases');
const vaReleasesDB = new VAReleasesDB();
const logger = require('../../utility/logger');

const data = new SlashCommandBuilder()
	.setName('release')
	.setDescription('Verified Artist Releases')
	.addSubcommand(subcommand =>
		subcommand
			.setName('add')
			.setDescription('Add a release (most fields can be updated later)')
			.addStringOption(option =>
				option
					.setName('title')
					.setDescription('Title of the project')
					.setRequired(true),
			)
			.addStringOption(option =>
				option
					.setName('type')
					.setDescription('Type of project')
					.setChoices(['Album', 'Single', 'Mixtape', 'EP'])
					.setRequired(true),
			)
			.addStringOption(option =>
				option
					.setName('release_date')
					.setDescription('Format: MM/DD/YY, default: TBA')
					.setRequired(false),
			)
			.addStringOption(option =>
				option
					.setName('desc')
					.setDescription('Give us a short description(<300 characters)')
					.setRequired(false),
			)
			.addStringOption(option =>
				option
					.setName('link')
					.setDescription('Provide a distro link to the release (song.link, etc)')
					.setRequired(false),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('update')
			.setDescription('Update a release (Only update the fields you need to update)')
			.addIntegerOption(option =>
				option
					.setName('id')
					.setDescription('Please provide the ID of the release (use `/release check`)')
					.setRequired(true),
			)
			.addStringOption(option =>
				option
					.setName('title')
					.setDescription('Update the title fo the release')
					.setRequired(false),
			)
			.addStringOption(option =>
				option
					.setName('release_date')
					.setDescription('Format: MM/DD/YY, Default: TBA')
					.setRequired(false),
			)
			.addStringOption(option =>
				option
					.setName('type')
					.setDescription('Update the type of release')
					.addChoices(['-', 'Album', 'Single', 'Mixtape', 'EP'])
					.setRequired(false),
			)
			.addStringOption(option =>
				option
					.setName('desc')
					.setDescription('Update the description')
					.setRequired(false)
					.setMaxLength(300),
			)
			.addStringOption(option =>
				option
					.setName('link')
					.setDescription('Update the link')
					.setMaxLength(200)
					.setRequired(false),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('remove')
			.setDescription('Remove a release')
			.addIntegerOption(option =>
				option
					.setName('id')
					.setDescription('Please provide the ID of the release you want to delete')
					.setRequired(true),
			),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('check')
			.setDescription('Check any artist release!')
			.addUserOption(option =>
				option
					.setName('artist')
					.setDescription('Artist you want to check (leave empty for yourself)')
					.setRequired(false),
			),
	);

async function handleAdd(interaction) {
	interaction.reply({ content: 'Adding release', flags: MessageFlags.Ephemeral });
}

async function handleUpdate(interaction) {
	interaction.reply({ content: 'Updating release', flags: MessageFlags.Ephemeral });
}

async function handleRemove(interaction) {
	interaction.reply({ content: 'Removing release', flags: MessageFlags.Ephemeral });
}

async function handleCheck(interaction) {
	interaction.reply({ content: 'Checking artist release', flags: MessageFlags.Ephemeral });
}
module.exports = {
	data,
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			await handleAdd(interaction);
		}
		else if (interaction.options.getSubcommand() === 'update') {
			await handleUpdate(interaction);
		}
		else if (interaction.options.getSubcommand() === 'remove') {
			await handleRemove(interaction);
		}
		else if (interaction.options.getSubcommand() === 'check') {
			await handleCheck(interaction);
		}
	},
};