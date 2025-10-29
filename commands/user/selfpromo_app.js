const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags } = require('discord.js');
const selfPromoMsgDB = require('../../db/selfpromo');
const logger = require('../../utility/logger');
const config = require('../../utility/config');
const { checkSelfPromoValidity } = require('../../utility/utils');

const data = new ContextMenuCommandBuilder()
  .setName('Mark Self-Promo')
  .setType(ApplicationCommandType.Message);

module.exports = {
  data,
  async execute(interaction) {
    const user = interaction.targetMessage.author;
    const valid = await checkSelfPromoValidity(interaction, user, 'App');
    if (!valid) return 0;

    // Check if this message has already been reported
    const alreadyReported = await selfPromoMsgDB.check(interaction.targetMessage.id);
    if (alreadyReported) {
      await interaction.reply({
        content: 'This message has already been reported for self-promotion.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await selfPromoMsgDB.add(interaction.targetMessage.id);
    let msg = `Woah there, <@${interaction.targetMessage.author.id}>,`;
    msg += ` it looks like you're sharing self-promotion outside of <#${config.selfPromoID}>!\n\n`;
    msg += 'If you don\'t have access to that channel, please stick around and get to know us a bit. Shortly after you join you will gain access. \n\n';
    msg += `In the meantime, check out <#${config.roleMenuID}> and assign yourself the Artist/Producer tag to unlock some extra channels. Please take a minute to check out our <#${config.rulesID}>\n\n`;
    msg += 'If you feel you should be a verified artist (who can self promo anywhere) feel free to reach out to the mods. Requirements: 50,000 streams on a single song *or* 10,000 monthly streams.\n\n';
    msg += 'If we don\'t know who you are, we likely won\'t care about your music.';

    const embed = new EmbedBuilder()
      .setTitle('Please Don\'t Self-Promo')
      .setDescription(msg);

    const reportChannel = await interaction.client.channels.cache.get(config.reportID);
    const reportMsg = `The following message was tagged for self-promotion by <@${interaction.user.id}:\n${interaction.targetMessage.url}\n`;
    logger.info(`${interaction.user.name} used the report self promo app command`);
    await interaction.targetMessage.reply({ embeds: [embed] });
    await interaction.reply({ content: 'Thanks, we let the user know about our self-promotion rules', flags: MessageFlags.Ephemeral });
    await reportChannel.send(reportMsg);
  },
};