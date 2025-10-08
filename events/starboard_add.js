const { Events } = require('discord.js');
const logger = require('../utility/logger');
const { StarboardSettingsDB, StarboardDB } = require('../db/starboard');
const config = require('../utility/config');

const { getTrueCount, getModCount, handleModboard, addToStarboard, updateStarboard } = require('../utility/starboard.js');

const starboardSettingsDB = new StarboardSettingsDB();
const starboardDB = new StarboardDB();

module.exports = {
  name: Events.MessageReactionAdd,
  once: false,
  async execute(payload) {
    if (payload.emoji.name == '⭐') {
      const message = await payload.message.fetch();
      const trueCount = await getTrueCount(message);
      const modCount = await getModCount(message);

      await handleModboard(message, modCount, payload);

      const threshold = await starboardSettingsDB.getThreshold(config.getGuildID());

      if (trueCount >= threshold) {
        const starboardChannel = await payload.client.channels.fetch(config.getStarboardID());
        if (!starboardChannel) {
          logger.error('Could not find starboard channel');
        }
        else if (!await starboardDB.check(payload.message.id)) {
          await addToStarboard(message, trueCount, starboardChannel);
        }
        else {
          await updateStarboard(message, trueCount, starboardChannel);
        }

      }
    }
  },
};