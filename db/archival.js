const logger = require('../utility/logger');
const Database = require('./database');

class ArchivalDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		logger.info('checking/creating archive table');
		await this.execute(`CREATE TABLE IF NOT EXISTS archival
            (CHANNELID TEXT NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            LEVEL INTEGER NOT NULL)`);
	}

	async get_channels(month, day) {
		logger.info('Getting channel ids from Archive table');
		const data = await this.execute(`SELECT CHANNELID FROM archival WHERE MONTH=${month} AND DAY=${day}`);
		return data.length == 0 ? false : true;
	}

	async get_level(channel_id) {
		logger.info('Getting archive level from Archive table');
		const data = await this.execute(`SELECT LEVEL FROM archival WHERE CHANNELID=${channel_id}`);
		return data.length == 0 ? false : data;
	}

	async check(channel_id) {
		logger.info('Checking if channel id is in Archive table');
		return await this.execute(`SELECT * FROM archival WHERE CHANNELID=${channel_id}`);
	}

	async set(channel_id, month, day, level) {
		logger.info(`Inserting ${channel_id} to be archived on ${month}/${day} at level : ${level}`);
		await this.execute(`INSERT INTO archival (CHANNELID, MONTH, DAY, LEVEL) VALUES (${channel_id}, ${month}, ${day}, ${level})`);
	}

	async update(channel_id, { level = null, month = null, day = null }) {
		logger.info('Updating archive table');
		if (level) {
			logger.info(`Updating archive level for ${channel_id} to ${level}`);
			await this.execute(`UPDATE archival SET LEVEL=${level} WHERE CHANNELID=${channel_id}`);
		}
		if (month) {
			logger.info(`Updating archive month for ${channel_id} to ${month}`);
			await this.execute(`UPDATE archival SET MONTH=${month} WHERE CHANNELID=${channel_id}`);
		}
		if (day) {
			logger.info(`Updating archive day for ${channel_id} to ${day}`);
			await this.execute(`UPDATE archival set DAY=${day} WHERE CHANNELID=${channel_id}`);
		}
	}

	async remove(channel_id) {
		logger.info(`Removing ${channel_id} from archival table`);
		await this.execute(`DELETE FROM archival WHERE CHANNELID='${channel_id}'`);
	}

	async drop() {
		logger.warn('Archival table dropped');
		await this.execute('DROP TABLE archival');
	}

}

module.exports = ArchivalDB;