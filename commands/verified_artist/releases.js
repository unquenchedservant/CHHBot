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
			.setName('update'),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('remove'),
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('check'),
	);