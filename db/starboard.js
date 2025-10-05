const Database = require('./database');
const logger = require('../utility/logger');
class StarboardSettingsDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		logger.info('Checking/creating starboardsettings table');
		await this.execute(`CREATE TABLE IF NOT EXISTS starboardsettings
            (GUILDID TEXT NOT NULL,
            STARBOARDCHANNEL TEXT NOT NULL,
            STARBOARDTHRESHOLD INTEGER NOT NULL)`);
	}

	async add(guildId, starboardChannel, starboardThreshold) {
		logger.info(`Adding starboard channel ID #${starboardChannel} and threshold ${starboardThreshold} for ${guildId} in starboardsettings table`);
		await this.execute(`INSERT INTO starboardsettings
            (GUILDID, STARBOARDCHANNEL, STARBOARDTHRESHOLD)
            VALUES (${guildId}, ${starboardChannel}, ${starboardThreshold})`);
	}

	async check(guildId) {
		logger.info(`Checking if starboard settings exist for ${guildId} in starboardsettings table`);
		const data = await this.execute(`SELECT * FROM starboardsettings WHERE GUILDID=${guildId}`);
		return this.checkLen(data);
	}

	async updateChannel(guildId, starboardChannel) {
		logger.info(`Setting starboard channel to ID #${starboardChannel} for guild ID #${guildId} in starboardsettings table`);
		console.log(`UPDATE CHANNEL ID: ${starboardChannel}`);
		await this.execute(`UPDATE starboardsettings
            SET STARBOARDCHANNEL='${starboardChannel}'
            WHERE GUILDID='${guildId}'`);
	}

	async updateThreshold(guildId, starboardThreshold) {
		logger.info(`Setting threshold to ${starboardThreshold} for guild ID #${guildId} in starboardsettings table`);
		await this.execute(`UPDATE starboardsettings
            SET STARBOARDTHRESHOLD=${starboardThreshold}
            WHERE GUILDID=${guildId}`);
	}

	async getSettings(guildId) {
		logger.info(`Getting settings for guild ID #${guildId} in starboardsettings table`);
		const data = await this.execute(`SELECT STARBOARDCHANNEL, STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=${guildId}`);
		return data[0];
	}

	async getThreshold(guildId) {
		logger.info(`Getting the threshold for guild ID #${guildId} in starboardsettings table`);
		const data = await this.execute(`SELECT STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=${guildId}`);
		return data[0].STARBOARDTHRESHOLD;
	}

	async getChannel(guildId) {
		logger.info(`Getting starboard channel for guild ID #${guildId} in starboardsettings table`);
		const data = await this.execute(`SELECT STARBOARDCHANNEL
            FROM starboardsettings WHERE GUILDID=${guildId}`);
		console.dir(data[0], { depth: null });
		console.log(`DATA IS ${data[0].STARBOARDCHANNEL.toString()}`);
		return data[0].STARBOARDCHANNEL.toString();
	}

	async remove(guildId) {
		logger.info(`Removing guild ID #${guildId} in the starboardsettings table`);
		await this.execute(`DELETE FROM starboardsettings WHERE GUILDID=${guildId}`);
	}

	async drop() {
		logger.warn('starboardsettings table dropped');
		await this.execute('DROP TABLE starboardsettings');
	}
}

class StarboardDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		logger.info('Checking/creating starboard table');
		await this.execute(`CREATE TABLE IF NOT EXISTS starboard
            (MSGID TEXT NOT NULL,
            STARBOARDMSGID TEXT NOT NULL)`);
	}

	async add(msg_id, starboard_msg_id) {
		logger.info(`Adding msg ID #${msg_id} with starboard msg ID #${starboard_msg_id} to starboard table`);
		await this.execute(`INSERT INTO starboard (MSGID, STARBOARDMSGID) VALUES (${msg_id}, ${starboard_msg_id})`);
	}

	async get(msg_id) {
		logger.info(`Getting msg ID #${msg_id} from starboard table`);
		const data = await this.execute(`SELECT STARBOARDMSGID FROM starboard WHERE MSGID=${msg_id}`);
		if (data) {
			return data[0].STARBOARDMSGID;
		}
		else {
			logger.info('No data on get');
			return 0;
		}
	}

	async update(msg_id, starboard_msg_id) {
		logger.info(`Updating starboard msg ID to #${starboard_msg_id} for msg ID #${msg_id} on the starboard table`);
		await this.execute(`UPDATE starboard SET STARBOARDMSGID=${starboard_msg_id} WHERE MSGID=${msg_id}`);
	}

	async check(msg_id) {
		logger.info(`Checking if msg ID #${msg_id} is on starboard table`);
		const data = await this.execute(`SELECT * FROM starboard WHERE MSGID=${msg_id}`);
		return this.checkLen(data);
	}

	async remove(msg_id) {
		logger.info(`Removing msg ID #${msg_id} from starboard table`);
		await this.execute(`DELETE FROM starboard WHERE MSGID=${msg_id}`);
	}

	async drop() {
		logger.warn('starboard table dropped');
		await this.execute('DROP TABLE starboard');
	}
}

class ModboardDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		logger.info('Checking/creating modboard table');
		await this.execute(`CREATE TABLE IF NOT EXISTS modboard
            (MSGID TEXT NOT NULL,
            MODBOARDMSGID TEXT NOT NULL)`);
	}

	async add(msg_id, modboard_msg_id) {
		logger.info(`Adding msg ID #${msg_id} with modboard msg ID #${modboard_msg_id} to modboard table`);
		await this.execute(`INSERT INTO modboard (MSGID, MODBOARDMSGID) VALUES (${msg_id}, ${modboard_msg_id})`);
	}

	async check(msg_id) {
		logger.info(`Checking if msg ID #${msg_id} is on modboard table`);
		const data = await this.execute(`SELECT * FROM modboard WHERE MSGID=${msg_id}`);
		return this.checkLen(data);
	}

	async get(msg_id) {
		logger.info(`Getting msg ID #${msg_id} from modboard table`);
		const data = await this.execute(`SELECT * FROM modboard WHERE MSGID=${msg_id}`);
		return data[0].MODBOARDMSGID;
	}

	async update(msg_id, modboard_msg_id) {
		logger.info(`Updating modboard msg ID to #${modboard_msg_id} for msg ID #${msg_id} on the modboard table`);
		await this.execute(`UPDATE modboard SET MODBOARDMSGID=${modboard_msg_id} WHERE MSGID=${msg_id}`);
	}

	async remove(msg_id) {
		logger.info(`Removing msg ID #${msg_id} from modboard table`);
		await this.execute(`DELETE FROM modboard WHERE MSGID=${msg_id}`);
	}

	async drop() {
		logger.warn('modboard table dropped');
		await this.execute('DROP TABLE modboard');
	}
}
module.exports = {
	StarboardDB,
	ModboardDB,
	StarboardSettingsDB,
};