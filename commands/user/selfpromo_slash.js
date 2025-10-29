const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utility/logger');
const config = require('../../utility/config');
const { checkSelfPromoValidity } = require('../../utility/utils');


const data = new SlashCommandBuilder()
  .setName('selfpromoalert')
  .setDescription('Use this when someone posts self promotion, or if someone asks about self promotion')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('optional: Tag the user')
      .setRequired(false),
  );

module.exports = {
  data,
  async execute(interaction) {

    let report = false;
    let titleStr = '';
    let msg = '';

    if (interaction.options.getUser('user')) {
      const valid = await checkSelfPromoValidity(interaction, interaction.options.getUser('user'), 'slash');
      if (!valid) return 0;
      logger.info(`Self-Promo report (slash) - Reporter: ${interaction.user.tag} | Reportee: ${interaction.options.getUser('user').tag}`);
      titleStr = 'Please Don\'t Self-Promote';

      msg += `Woah there, <@${interaction.options.getUser('user').id}>,`;
      msg += ` it looks like you're sharing self-promotion outside of <#${config.selfPromoID}>!\n\n`;
      report = true;
    }
    else {
      logger.info(`Self-Promo report (slash) - Reporter: ${interaction.user.tag} | Reportee: N/A`);
      titleStr = 'A Reminder About Our Self Promotion Rules';
      msg = `Please only self-promote in <#${config.selfPromoID}>!\n\n`;
    }
    msg += 'If you don\'t have access to that channel, please stick around and get to know us a bit. Shortly after you join you will gain access. \n\n';
    msg += `In the meantime, check out <#${config.roleMenuID}> and assign yourself the Artist/Producer tag to unlock some extra channels. Also, please take a minute to check out our <#${config.rulesID}>\n\n`;
    msg += 'If you feel you should be a verified artist (who can self promote anywhere) feel free to reach out to the mods. Requirements:\n50,000 streams on a single song *OR*\n10,000 monthly streams.\n\n';
    msg += 'If we don\'t know who you are, we likely won\'t care about your music.';

    const embed = new EmbedBuilder()
      .setTitle(titleStr)
      .setDescription(msg);

    if (report) {
      const user = interaction.options.getUser('user');
      const reportUser = interaction.user.tag;
      const reportChannel = await interaction.client.channels.cache.get(config.reportID);
      const replyMsg = await interaction.reply({ embeds: embed})
      const reportMsg = `<@${user}> was tagged for self-promotion by <@${reportUser}>. \n\n Jump to message:${replyMsg.url}\n`;
      await reportChannel.send(reportMsg);
    }
  },
};
