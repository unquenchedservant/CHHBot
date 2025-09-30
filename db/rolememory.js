const logger = require('../utility/logger');
const Database = require('./database');

class RoleMemoryDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS roleMemoryEnabled
            (GUILDID INTEGER NOT NULL,
            ENABLED INT NOT NULL)`);
	}

	async check(guild_id) {
		const data = await this.execute(`SELECT * FROM roleMemoryEnabled WHERE GUILDID=${guild_id}`);
		if (!data.length == 0) {
			return data[0].ENABLED;
		}
		else {
			return 0;
		}
	}

	async toggle(guild_id) {
		const data = await this.execute(`SELECT * FROM roleMemoryEnabled WHERE GUILDID=${guild_id}`);
		let newEnabled = 1;
		if (!data.length == 0) {
			newEnabled = data[0].ENABLED == 0 ? 1 : 0;
			logger.info(`newEnabled ${guild_id}`);
			await this.execute(`UPDATE roleMemoryEnabled SET ENABLED=${newEnabled} WHERE GUILDID=${guild_id}`);
		}
		else {
			await this.execute(`INSERT INTO roleMemoryEnabled (GUILDID, ENABLED) VALUES (${guild_id}, ${1})`);
		}
	}

	async get(guild_id) {
		const data = await this.execute(`SELECT * FROM roleMemoryEnabled WHERE GUILDID=${guild_id}`);
		return returndata = data.length == 0 ? true : false;
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
}

module.exports = { RoleDB, RoleMemoryDB };