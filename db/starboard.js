const Database = require('./database');
const logger = require('../utility/logger');
class StarboardSettingsDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS starboardsettings
            (GUILDID TEXT NOT NULL,
            STARBOARDCHANNEL TEXT NOT NULL,
            STARBOARDTHRESHOLD INTEGER NOT NULL)`);
	}

	async add(guildId, starboardChannel, starboardThreshold) {
		await this.execute(`INSERT INTO starboardsettings
            (GUILDID, STARBOARDCHANNEL, STARBOARDTHRESHOLD)
            VALUES (${guildId}, ${starboardChannel}, ${starboardThreshold})`);
	}

	async check(guildId) {
		const data = await this.execute(`SELECT * FROM starboardsettings WHERE GUILDID=${guildId}`);
		return this.checkLen(data);
	}

	async updateChannel(guildId, starboardChannel) {
		console.log(`UPDATE CHANNEL ID: ${starboardChannel}`);
		await this.execute(`UPDATE starboardsettings
            SET STARBOARDCHANNEL='${starboardChannel}'
            WHERE GUILDID='${guildId}'`);
	}

	async updateThreshold(guildId, starboardThreshold) {
		await this.execute(`UPDATE starboardsettings
            SET STARBOARDTHRESHOLD=${starboardThreshold}
            WHERE GUILDID=${guildId}`);
	}

	async getSettings(guildId) {
		const data = await this.execute(`SELECT STARBOARDCHANNEL, STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=${guildId}`);
		return data[0];
	}

	async getThreshold(guildId) {
		const data = await this.execute(`SELECT STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=${guildId}`);
		return data[0].STARBOARDTHRESHOLD;
	}

	async getChannel(guildId) {
		const data = await this.execute(`SELECT STARBOARDCHANNEL
            FROM starboardsettings WHERE GUILDID=${guildId}`);
		console.dir(data[0], { depth: null });
		console.log(`DATA IS ${data[0].STARBOARDCHANNEL.toString()}`);
		return data[0].STARBOARDCHANNEL.toString();
	}

	async remove(guildId) {
		await this.execute(`DELETE FROM starboardsettings WHERE GUILDID=${guildId}`);
	}

	async drop() {
		await this.execute('DROP TABLE starboardsettings');
	}
}

class StarboardDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS starboard
            (MSGID TEXT NOT NULL,
            STARBOARDMSGID TEXT NOT NULL)`);
	}

	async add(msg_id, starboard_msg_id) {
		await this.execute(`INSERT INTO starboard (MSGID, STARBOARDMSGID) VALUES (${msg_id}, ${starboard_msg_id})`);
	}

	async get(msg_id) {
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
		await this.execute(`UPDATE starboard SET STARBOARDMSGID=${starboard_msg_id} WHERE MSGID=${msg_id}`);
	}

	async check(msg_id) {
		const data = await this.execute(`SELECT * FROM starboard WHERE MSGID=${msg_id}`);
		return this.checkLen(data);
	}

	async remove(msg_id) {
		await this.execute(`DELETE FROM starboard WHERE MSGID=${msg_id}`);
	}

	async drop() {
		await this.execute('DROP TABLE starboard');
	}
}

class ModboardDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS modboard
            (MSGID TEXT NOT NULL,
            MODBOARDMSGID TEXT NOT NULL)`);
	}

	async add(msg_id, modboard_msg_id) {
		logger.info(`add modboardmsgid : ${modboard_msg_id}`);
		await this.execute(`INSERT INTO modboard (MSGID, MODBOARDMSGID) VALUES (${msg_id}, ${modboard_msg_id})`);
	}

	async check(msg_id) {
		const data = await this.execute(`SELECT * FROM modboard WHERE MSGID=${msg_id}`);
		return this.checkLen(data);
	}

	async get(msg_id) {
		logger.info(`Msg id in get: ${msg_id}`);
		const data = await this.execute(`SELECT * FROM modboard WHERE MSGID=${msg_id}`);
		console.dir(data[0], { depth: null });
		logger.info(`raw messageboardid : ${data[0].MODBOARDMSGID}`);
		logger.info(`bigint: ${BigInt(data[0].MODBOARDMSGID)}`);
		return `${BigInt(data[0].MODBOARDMSGID)}`;
	}

	async update(msg_id, modboard_msg_id) {
		await this.execute(`UPDATE modboard SET MODBOARDMSGID=${modboard_msg_id} WHERE MSGID=${msg_id}`);
	}

	async remove(msg_id) {
		await this.execute(`DELETE FROM modboard WHERE MSGID=${msg_id}`);
	}

	async drop() {
		await this.execute('DROP TABLE modboard');
	}
}
module.exports = {
	StarboardDB,
	ModboardDB,
	StarboardSettingsDB,
};