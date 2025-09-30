const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags } = require('discord.js');
const SelfPromoMsgDB = require('../../db/selfpromo');
const logger = require('../../utility/logger');
const config = require('../../utility/config');
const { check_validity } = require('../../utility/utils');

const selfpromomsgdb = new SelfPromoMsgDB();


const data = new ContextMenuCommandBuilder()
	.setName('Mark Self-Promo')
	.setType(ApplicationCommandType.Message);

module.exports = {
	data,
	async execute(interaction) {
		logger.debug('CHECK CHECK');
		const user = interaction.targetMessage.author;
		const valid = await check_validity(interaction, user, 'App');
		if (!valid) return 0;
		await selfpromomsgdb.add(interaction.targetMessage.id);
		let msg = `Woah there, <@${interaction.targetMessage.author.id}>,`;
		msg += ` it looks like you're sharing self-promotion outside of <#${config.get_self_promo_id()}>!\n\n`;
		msg += 'If you don\'t have access to that channel, please stick around and get to know us a bit. Shortly after you join you will gain access. \n\n';
		msg += `In the meantime, check out <#${config.get_role_menu_id()}> and assign yourself the Artist/Producer tag to unlock some extra channels. Please take a minute to check out our <#${config.get_rules_id()}>\n\n`;
		msg += 'If you feel you should be a verified artist (who can self promo anywhere) feel free to reach out to the mods. Requirements: 50,000 streams on a single song *or* 10,000 monthly streams.\n\n';
		msg += 'If we don\'t know who you are, we likely won\'t care about your music.';

		const embed = new EmbedBuilder()
			.setTitle('Please Don\'t Self-Promo')
			.setDescription(msg);

		await interaction.targetMessage.reply({ embeds: [embed] });
		const report_channel = await interaction.client.channels.cache.get(config.get_report_id());
		await interaction.reply({ content: 'Thanks, we let the user know about our self-promotion rules', flags: MessageFlags.Ephemeral });
		const reportMsg = `The following message was tagged for self-promotion by <@${interaction.user.id}:\n${interaction.targetMessage.url}\n`;
		await report_channel.send(reportMsg);
	},
};