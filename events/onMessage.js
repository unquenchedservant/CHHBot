const { Events } = require('discord.js');
const logger = require('../utility/logger');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(client) {
		logger.info(`Message received  on ${client.user.tag}`);
	},
};