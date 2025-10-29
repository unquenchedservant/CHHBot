const { Events } = require('discord.js');
const { starboardSettingsDB, starboardDB } = require('../db/starboard');
const config = require('../utility/config');
const logger = require('../utility/logger.js');

const { getTrueCount, getModCount, handleModboard, updateStarboard, removeFromStarboard } = require('../utility/starboard.js');

module.exports = {
  name: Events.MessageReactionRemove,
  once: false,
  async execute(payload) {
    if (payload.emoji.name == '⭐') {
      const message = await payload.message.fetch();
      const trueCount = await getTrueCount(message);
      const modCount = await getModCount(message);

      await handleModboard(message, modCount, payload);

      const starboardChannel = await payload.client.channels.fetch(config.starboardID);
      const threshold = await starboardSettingsDB.getThreshold(config.guildID);

      if (trueCount < threshold) {
        if (await starboardDB.check(payload.message.id)) {
          logger.info('removeFromStarboard');
          await removeFromStarboard(message, starboardChannel);
        }
      }
      else if (await starboardDB.check(payload.message.id)) {
        logger.info('updateStarboard');
        await updateStarboard(message, trueCount, starboardChannel);
      }
    }
  },
};