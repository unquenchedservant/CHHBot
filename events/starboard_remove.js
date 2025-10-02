const { Events } = require('discord.js');
const { StarboardSettingsDB, StarboardDB } = require('../db/starboard');
const config = require('../utility/config');

const { getTrueCount, getModCount, handleModboard, updateStarboard, removeFromStarboard } = require('../utility/starboard.js');

const starboardSettingsDB = new StarboardSettingsDB();
const starboardDB = new StarboardDB();

module.exports = {
	name: Events.MessageReactionRemove,
	once: false,
	async execute(payload) {
		if (payload.emoji.name == '⭐') {
			const message = await payload.message.fetch();
			const trueCount = await getTrueCount(message);
			const modCount = await getModCount(message);

			await handleModboard(message, modCount, payload);

			const starboardChannel = await payload.client.channels.fetch(config.get_starboard_channel());

			if (trueCount < starboardSettingsDB.getThreshold(config.get_guild_id())) {
				if (starboardDB.check(payload.message.id)) {
					await removeFromStarboard(message, starboardChannel);
				}
			}
			else {
				await updateStarboard(message, trueCount, starboardChannel);
			}
		}
	},
};