const logger = require('../utility/logger');
const Database = require('./database');

class RoleMemoryDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		logger.info('Checking/creating roleMemory table');
		await this.execute(`CREATE TABLE IF NOT EXISTS roleMemory
            (GUILDID TEXT NOT NULL,
            ENABLED INT NOT NULL)`);
	}

	async check(guild_id) {
		logger.info('Checking if role memory is enabled in the roleMemory table');
		const data = await this.execute(`SELECT * FROM roleMemory WHERE GUILDID=${guild_id}`);
		if (data) {
			return data[0].ENABLED;
		}
		else {
			return 0;
		}
	}

	async toggle(guild_id) {
		logger.info(`Toggling role memory for ${guild_id} in the roleMemory table`);
		const data = await this.execute(`SELECT * FROM roleMemory WHERE GUILDID=${guild_id}`);
		let newEnabled = 1;
		if (!data.length == 0) {
			newEnabled = data[0].ENABLED == 0 ? 1 : 0;
			await this.execute(`UPDATE roleMemory SET ENABLED=${newEnabled} WHERE GUILDID=${guild_id}`);
		}
		else {
			await this.execute(`INSERT INTO roleMemory (GUILDID, ENABLED) VALUES (${guild_id}, ${1})`);
		}
	}

	async get(guild_id) {
		logger.info(`Getting roleMemory status for ${guild_id} from the roleMemory table`);
		const data = await this.execute(`SELECT * FROM roleMemory WHERE GUILDID=${guild_id}`);
		return data.length == 0 ? true : false;
	}
}

class RoleDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		logger.info('Checking/creating roles table');
		await this.execute(`CREATE TABLE IF NOT EXISTS roles
            (UID INT NOT NULL,
            RID INT NOT NULL)`);
	}

	async add(user_id, role_id) {
		logger.info(`Adding role ID #${role_id} for user ID #${user_id} in the roles table`);
		await this.execute(`INSERT INTO roles (UID, RID) VALUES (${user_id}, ${role_id})`);
	}

	async get(user_id) {
		logger.info(`Getting user ID #${user_id}'s roles`);
		const data = await this.execute(`SELECT * FROM roles WHERE UID=${user_id}`);
		const roles = [];
		for (const row of data) {
			roles.push(row[1]);
		}
		return roles;
	}

	async remove(user_id) {
		logger.info(`Removing roles from user ID #${user_id}`);
		await this.execute(`DELETE FROM roles WHERE UID=${user_id}`);
	}
}

module.exports = { RoleDB, RoleMemoryDB };