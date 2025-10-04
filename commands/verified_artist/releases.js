const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const VAReleasesDB = require('../../db/vareleases');
const vaReleasesDB = new VAReleasesDB();
const logger = require('../../utility/logger');
const { getUsername } = require('../../utility/utils');

const config = require('../../utility/config');

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
					.setChoices(
						{ name: 'Album', value: 'Album' },
						{ name: 'Single', value: 'Single' },
						{ name: 'Mixtape', value: 'Mixtape' },
						{ name: 'EP', value: 'EP' },
					)
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
					.addChoices(
						{ name: '-', value: '-' },
						{ name: 'Album', value: 'Album' },
						{ name: 'Single', value: 'Single' },
						{ name: 'Mixtape', value: 'Mixtape' },
						{ name: 'EP', value: 'EP' },
					)
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

async function buildAnnouncementEmbed(embedTitle, msg, title, releaseDate, desc, link, rType) {
	const embed = new EmbedBuilder()
		.setTitle(embedTitle)
		.setDescription(`${msg}`)
		.addFields(
			{ name: 'Title', value: title },
			{ name: 'Release Date', value: releaseDate },
			{ name: 'Description', value: desc },
			{ name: 'Type', value: rType },
			{ name: 'Link', value: link },
		);
	embed.setDescription(msg);
	return embed;
}

async function checkVerified(user, guild) {
	const member = await guild.members.fetch(user.id);
	return member.roles.cache.some(role => role.name === 'Verified Artist');
}
async function handleAdd(interaction) {
	const userID = interaction.user.id;
	const title = interaction.options.getString('title');
	const rType = interaction.options.getString('type');
	let releaseDate = interaction.options.getString('release_date');
	let desc = interaction.options.getString('desc');
	let link = interaction.options.getString('link');
	if (!desc) {
		desc = '';
	}
	if (!releaseDate) {
		releaseDate = 'TBA';
	}
	if (!link) {
		link = 'None';
	}

	if (!await checkVerified(interaction.user, interaction.guild)) {
		await interaction.reply({ content: 'You are not a verified artist!', flags: MessageFlags.Ephemeral });
	}
	const username = getUsername(interaction.user);
	logger.info(`${username} added a new ${rType} release, releasing: ${releaseDate}`);
	const id = await vaReleasesDB.add(userID, username, title, releaseDate, desc, rType, link);
	const embedTitle = 'New Release Added';
	const embedDsc = `<@${userID}> announced a new project!`;
	const annEmbed = await buildAnnouncementEmbed(embedTitle, embedDsc, title, releaseDate, desc, link, rType);
	const annCh = await interaction.client.channels.fetch(config.get_announcements_channel_id());
	await annCh.send({ embeds: [annEmbed] });
	interaction.reply({ content: `Successfully added that release, ID #${id}. Please use this ID to update or delete your release at any time`, flags: MessageFlags.Ephemeral });
}

async function handleUpdate(interaction) {
	const id = interaction.options.getInteger('id');
	let title = interaction.options.getString('title');
	let releaseDate = interaction.options.getString('release_date');
	let rType = interaction.options.getString('type');
	let desc = interaction.options.getString('desc');
	let link = interaction.options.getString('link');
	const username = getUsername(interaction.user);
	if (!title) {
		title = '';
	}
	if (!releaseDate) {
		releaseDate = '';
	}
	if (!rType) {
		rType = '';
	}
	if (!desc) {
		desc = '';
	}
	if (!link) {
		link = '';
	}
	if (rType === '-') {
		rType = '';
	}
	if (!await checkVerified(interaction.user, interaction.guild)) {
		interaction.reply({ content: 'You are not a Verified Artist', flags: MessageFlags.Ephemeral });
		return;
	}
	if (!await vaReleasesDB.check(id)) {
		logger.info(`${username} tried to update a release that didn't exist`);
		interaction.reply({ content: 'That release does not exist', flags: MessageFlags.Ephemeral });
		return;
	}
	const releaseUser = await vaReleasesDB.getUserByID(id);
	logger.info(`User id: ${releaseUser[0].UserID}`);
	logger.info(`User id: ${interaction.user.id}`);
	if (`${releaseUser[0].UserID}` !== `${interaction.user.id}`) {
		logger.info(`${username} tried to update a release that wasn't theirs`);
		interaction.reply({ content: 'That release is not yours.', flags: MessageFlags.Ephemeral });
		return;
	}
	await vaReleasesDB.update(id, title, releaseDate, desc, rType, link);
	logger.info(`${username} successfully updated release ID #${id}`);
	const release = await vaReleasesDB.getByID(id);
	const embedTitle = 'Updated Release';
	const embedDsc = `<@${interaction.user.id}> updated an upcoming release`;
	const annEmbed = await buildAnnouncementEmbed(embedTitle, embedDsc, release[0].ReleaseTitle, release[0].ReleaseDate, release[0].Desc, release[0].Link, release[0].Type);
	const annCh = await interaction.client.channels.fetch(config.get_announcements_channel_id());
	await annCh.send({ embeds: [annEmbed] });
	interaction.reply({ content: `Successfully updated release ID #${id}`, flags: MessageFlags.Ephemeral });
}

async function handleRemove(interaction) {
	const username = getUsername(interaction.user);
	const id = interaction.options.getInteger('id');
	if (!await vaReleasesDB.check(id)) {
		logger.info(`${username} tried to remove a release that didn't exist`);
		await interaction.reply({ content: 'That release does not exist', flags: MessageFlags.Ephemeral });
		return;
	}
	const releaseUser = await vaReleasesDB.getUserByID(id);
	if (!releaseUser[0].UserID == interaction.user.id) {
		logger.info(`${username} tried to remove a release that wasn't theirs`);
		await interaction.reply({ content: 'That release is not yours.', flags: MessageFlags.Ephemeral });
		return;
	}
	const release = await vaReleasesDB.getByID(id);
	logger.info(`Release: ${release[0].ReleaseTitle}`);
	const embedTitle = 'Cancelled Release';
	const embedDsc = `<@${interaction.user.id}> removed an upcoming release`;
	const annEmbed = await buildAnnouncementEmbed(embedTitle, embedDsc, release[0].ReleaseTitle, release[0].ReleaseDate, release[0].Desc, release[0].Link, release[0].Type);
	const annCh = await interaction.client.channels.fetch(config.get_announcements_channel_id());
	await annCh.send({ embeds: [annEmbed] });
	await vaReleasesDB.delete(id);
	await interaction.reply({ content: `Successfully deleted release #${id}`, flags: MessageFlags.Ephemeral });
}

async function handleCheck(interaction) {
	let is_self = false;
	let artist = await interaction.options.getUser('artist');
	if (!artist) {
		artist = interaction.user;
		is_self = true;
	}

	const releases = await vaReleasesDB.getByUser(artist.id);
	const embed = new EmbedBuilder()
		.setTitle(`${getUsername(artist)}'s Releases`);
	if (!vaReleasesDB.checkLen(releases)) {
		let descMsg = 'No release found';
		if (await checkVerified(interaction.user, interaction.guild) && is_self) {
			descMsg += '. Feel free to a dd one using `release add`';
		}
		embed.setDescription(descMsg);
	}
	else {
		logger.info('Checking releases');
		for (const release of releases) {
			const releaseID = release.ID;
			const title = release.ReleaseTitle;
			const date = release.ReleaseDate;
			const rType = release.Type;
			const link = release.Link;
			const desc = release.Desc;

			const linkText = link != 'None' ? `[Link](${link})` : 'None';
			const field_value = `**Release Date:** ${date}\n**Type:** ${rType}\n**Description:** ${desc}\n**Link:** ${linkText}`;
			const name_field = (await checkVerified(interaction.user, interaction.guild) && is_self) ? `ID: #${releaseID} - ${title}` : `${title}`;
			embed.addFields({ name: name_field, value: field_value, inline: false });
		}
	}
	interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
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