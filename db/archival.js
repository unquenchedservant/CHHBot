const Database = require('./database');

class ArchivalDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS archival
            (CHANNELID TEXT NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            LEVEL INTEGER NOT NULL)`);
	}

	async get_channels(month, day) {
		const data = await this.execute(`SELECT CHANNELID FROM archival WHERE MONTH=${month} AND DAY=${day}`);
		return data.length == 0 ? false : true;
	}

	async get_level(channel_id) {
		const data = await this.execute(`SELECT LEVEL FROM archival WHERE CHANNELID=${channel_id}`);
		return data.length == 0 ? false : data;
	}

	async check(channel_id) {
		return await this.execute(`SELECT * FROM archival WHERE CHANNELID=${channel_id}`);
	}

	async set(channel_id, month, day, level) {
		await this.execute(`INSERT INTO archival (CHANNELID, MONTH, DAY, LEVEL) VALUES (${channel_id}, ${month}, ${day}, ${level})`);
	}

	async update(channel_id, { level = null, month = null, day = null }) {
		if (level && month && day) {
			await this.execute(`UPDATE archival SET LEVEL=${level}, MONTH=${month}, DAY=${day} WHERE CHANNELID=${channel_id}`);
		}
		else if (level && month) {
			await this.execute(`UPDATE archival SET LEVEL=${level}, MONTH=${month} WHERE CHANNELID=${channel_id}`);
		}
		else if (level) {
			await this.execute(`UPDATE archival SET LEVEL=${level} WHERE CHANNELID=${channel_id}`);
		}
		else if (month) {
			await this.execute(`UPDATE archival SET MONTH=${month} WHERE CHANNELID=${channel_id}`);
		}
	}

	async remove(channel_id) {
		await this.execute(`DELETE FROM archival WHERE CHANNELID='${channel_id}'`);
	}

	async drop() {
		await this.execute('DROP TABLE archival');
	}

	async migrate() {
		await this.execute(`CREATE TABLE IF NOT EXISTS archival_new
            (CHANNELID TEXT NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            LEVEL INTEGER NOT NULL)`);

		// Copy data from old table, converting only IDs to strings
		await this.execute(`INSERT INTO archival_new 
            SELECT CAST(CHANNELID as TEXT), 
                   MONTH, 
                   DAY, 
                   LEVEL
            FROM archival`);

		// Drop old table
		await this.execute('DROP TABLE archival');

		// Rename new table to original name
		await this.execute('ALTER TABLE archival_new RENAME TO archival');

		logger.info('Successfully migrated archival table');
	}
}

module.exports = ArchivalDB;