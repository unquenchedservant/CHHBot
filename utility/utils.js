const dotenv = require('dotenv');
const logger = require('./logger');
const { MessageFlags } = require('discord.js');

dotenv.config();


function getUsername(user) {
  let uname = '';
  if (user.tag) {
    uname = user.tag;
  }
  else if (user.username) {
    uname = user.username;
  }
  else {
    uname = user.globalName;
  }
  return uname;
}
async function checkSelfPromoValidity(interaction, user, type) {
  const userRoles = interaction.member.roles.cache.map(role => role.name.toLowerCase());
  if (user.bot) {
    if (user.id == '701044392378499152' || user.id == '436692846242955264') {
      logger.info(`Self-Promo report (${type}) - CHH Bot | Put on blast`);
      await interaction.reply({ content: 'You thought.' });
    }
    else {
      logger.info(`Self-Promo report (${type}) - Bot | No Action`);
      await interaction.reply({ content: 'Thank you for the report, but this is a bot.', flags:MessageFlags.Ephemeral });
    }
    return false;
  }
  if (userRoles.includes('Verified Artist')) {
    logger.info(`Self-Promo report (${type}) - Verified Artist | No Action`);
    await interaction.reply({ content: 'Thank you for the report, but this is a verified artist', flags: MessageFlags.Ephemeral });
    return false;
  }
  else if (userRoles.includes('Mod')) {
    logger.info(`Self-Promo report (${type}) - Mod | No Action`);
    await interaction.reply({ content: 'Thank you for the report, but this is a mod.', flags: MessageFlags.Ephemeral });
    return false;
  }
  else if (userRoles.includes('Admin')) {
    logger.info(`Self-Promo report (${type}) - Admin | No Action`);
    await interaction.reply({ content: 'Thank you for the report, but this is an admin.', flags: MessageFlags.Ephemeral });
    return false;
  }
  else {
    return true;
  }
}

module.exports = {
  checkSelfPromoValidity,
  getUsername,
};