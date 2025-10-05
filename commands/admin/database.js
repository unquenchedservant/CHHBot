const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { ModboardDB, StarboardDB, StarboardSettingsDB } = require('../../db/starboard');
const ArchivalDB = require('../../db/archival');
const BirthdayDB = require('../../db/birthday');
const { RoleMemoryDB, RoleDB } = require('../../db/rolememory');
const SelfPromoMsgDB = require('../../db/selfpromo');
const VAReleasesDB = require('../../db/vareleases');

const modboardDB = new ModboardDB();
const starboardDB = new StarboardDB();
const starboardSettingsDB = new StarboardSettingsDB();
const archivalDB = new ArchivalDB();
const birthdayDB = new BirthdayDB();
const roleDB = new RoleDB();
const roleMemoryDB = new RoleMemoryDB();
const selfPromoMsgDB = new SelfPromoMsgDB();
const vaReleasesDB = new VAReleasesDB();

const data = new SlashCommandBuilder()
	.setName('updatedb')
	.setDescription('Updates db from integer version to string version')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

module.exports = {
	data,
	async execute(interaction) {
		await modboardDB.migrate();
		await starboardDB.migrate();
		await starboardSettingsDB.migrate();
		await archivalDB.migrate();
		await birthdayDB.migrate();
		await roleDB.migrate();
		await roleMemoryDB.migrate();
		await selfPromoMsgDB.migrate();
		await vaReleasesDB.migrate();
		interaction.reply({ content: 'Database migrated', flags: MessageFlags.Ephemeral });
	},
};
