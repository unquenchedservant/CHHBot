const logger = require('../utility/logger');
const Database = require('./database');

class RoleMemoryDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS roleMemory
            (GUILDID TEXT NOT NULL,
            ENABLED INT NOT NULL)`);
	}

	async check(guild_id) {
		const data = await this.execute(`SELECT * FROM roleMemory WHERE GUILDID=${guild_id}`);
		if (!data.length == 0) {
			return data[0].ENABLED;
		}
		else {
			return 0;
		}
	}

	async toggle(guild_id) {
		const data = await this.execute(`SELECT * FROM roleMemory WHERE GUILDID=${guild_id}`);
		let newEnabled = 1;
		if (!data.length == 0) {
			newEnabled = data[0].ENABLED == 0 ? 1 : 0;
			logger.info(`newEnabled ${guild_id}`);
			await this.execute(`UPDATE roleMemory SET ENABLED=${newEnabled} WHERE GUILDID=${guild_id}`);
		}
		else {
			await this.execute(`INSERT INTO roleMemory (GUILDID, ENABLED) VALUES (${guild_id}, ${1})`);
		}
	}

	async get(guild_id) {
		const data = await this.execute(`SELECT * FROM roleMemory WHERE GUILDID=${guild_id}`);
		return returndata = data.length == 0 ? true : false;
	}
	async migrate() {
		const database_name = '';
		if (
			!this.checkLen(await this.execute('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'rolememoryenabled\''))
		) {
			return 0;
		}

		await this.execute(`CREATE TABLE IF NOT EXISTS roleMemory
                (GUILDID TEXT NOT NULL,
                ENABLED INTEGER NOT NULL)`);

		// Copy data from old table, converting only IDs to strings
		await this.execute(`INSERT INTO roleMemory
                SELECT CAST(GUILDID as TEXT), 
                       ENABLED
                FROM ${database_name}`);

		// Drop old table
		await this.execute(`DROP TABLE ${database_name}`);

		logger.info('Successfully migrated roleMemory table');
	}
}

class RoleDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS roles
            (UID INT NOT NULL,
            RID INT NOT NULL)`);
	}

	async add(user_id, role_id) {
		await this.execute(`INSERT INTO roles (UID, RID) VALUES (${user_id}, ${role_id})`);
	}

	async get(user_id) {
		const data = await this.execute(`SELECT * FROM roles WHERE UID=${user_id}`);
		roles = [];
		for (const row of data) {
			roles.push(row[1]);
		}
		return roles;
	}

	async remove(user_id) {
		await this.execute(`DELETE FROM roles WHERE UID=${user_id}`);
	}

	async migrate() {
		// Create new table with TEXT columns

		await this.execute(`CREATE TABLE IF NOT EXISTS roles_new
        (UID TEXT NOT NULL,
        RID TEXT NOT NULL)`);

		// Copy data from old table, converting IDs to strings
		await this.execute(`INSERT INTO roles_new 
        SELECT CAST(UID as TEXT), CAST(RID as TEXT)
        FROM roles`);

		// Drop old table
		await this.execute('DROP TABLE roles');

		// Rename new table to original name
		await this.execute('ALTER TABLE roles_new RENAME TO roles');
	}
}

module.exports = { RoleDB, RoleMemoryDB };