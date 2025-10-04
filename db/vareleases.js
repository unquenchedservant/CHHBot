const Database = require('./database');
const logger = require('../utility/logger');

class VAReleasesDB extends Database {
	constructor() {
		super();
		this.create();
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS vareleases
            (ID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserID TEXT NOT NULL,
            UserName VARCHAR(100) NOT NULL,
            ReleaseTitle VARCHAR(100) NOT NULL,
            ReleaseDate VARCHAR(12) NOT NULL,
            Desc VARCHAR(300) NOT NULL,
            Type VARCHAR(10) NOT NULL,
            Link VARCHAR(200) NOT NULL)`);
	}

	async add(userId, userName, releaseTitle, releaseDate, desc, type, link) {
		await this.execute(`INSERT INTO vareleases 
            (UserID, UserName, ReleaseTitle, ReleaseDate, Desc, Type, Link) 
            VALUES 
            ("${userId}","${userName}","${releaseTitle}","${releaseDate}","${desc}","${type}","${link}")`);
		const data = await this.execute(`SELECT ID FROM vareleases 
            WHERE 
            UserID="${userId}" AND UserName="${userName}" AND ReleaseTitle="${releaseTitle}" AND ReleaseDate="${releaseDate}" AND Desc="${desc}" AND Type="${type}" AND Link="${link}"`);

		return data[0].ID;
	}

	async getUserByID(ID) {
		const data = await this.execute(`SELECT UserID FROM vareleases WHERE ID=${ID}`);
		return data;
	}

	async getByID(ID) {
		const data = await this.execute(`SELECT * FROM vareleases WHERE ID=${ID}`);
		return data;
	}

	async getByUser(userId) {
		const data = await this.execute(`SELECT * FROM vareleases WHERE UserID=${userId}`);
		return data;
	}

	async getByDate(date) {
		const data = await this.execute(`SELECT * FROM vareleases WHERE ReleaseDate="${date}"`);
		return data;
	}

	async check(ID) {
		const data = await this.getUserByID(ID);
		return this.checkLen(data);
	}

	async delete(ID) {
		await this.execute(`DELETE FROM vareleases WHERE ID=${ID}`);
	}

	async update(ID, releaseTitle = '', releaseDate = '', desc = '', rType = '', link = '') {
		if (!releaseTitle == '') {
			await this.execute(`UPDATE vareleases SET ReleaseTitle="${releaseTitle}" WHERE ID=${ID}`);
		}
		if (!releaseDate == '') {
			await this.execute(`UPDATE vareleases SET ReleaseDate="${releaseDate}" WHERE ID=${ID}`);
		}
		if (!desc == '') {
			await this.execute(`UPDATE vareleases SET Desc="${desc}" WHERE ID=${id}`);
		}
		if (!rType == '') {
			await this.execute(`UPDATE vareleases SET TYPE="${rType}" WHERE ID=${id}`);
		}
		if (!link == '') {
			await this.execute(`UPDATE vareleases SET LINK="${link}" WHERE ID=${id}`);
		}
	}

	async migrate() {
		const database_name = 'vareleases';
		await this.execute(`CREATE TABLE IF NOT EXISTS ${database_name}_new
            (ID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserID TEXT NOT NULL,
            UserName VARCHAR(100) NOT NULL,
            ReleaseTitle VARCHAR(100) NOT NULL,
            ReleaseDate VARCHAR(12) NOT NULL,
            Desc VARCHAR(300) NOT NULL,
            Type VARCHAR(10) NOT NULL,
            Link VARCHAR(200) NOT NULL)`);

		// Copy data from old table, converting only IDs to strings
		await this.execute(`INSERT INTO ${database_name}_new 
                SELECT ID,
                       CAST(UserID as TEXT), 
                       UserName, 
                       ReleaseTitle, 
                       ReleaseDate,
                       Desc,
                       Type,
                       Link
                FROM ${database_name}`);

		// Drop old table
		await this.execute(`DROP TABLE ${database_name}`);

		// Rename new table to original name
		await this.execute(`ALTER TABLE ${database_name}_new RENAME TO ${database_name}`);

		logger.info(`Successfully migrated ${database_name} table`);

	}
}

module.exports = VAReleasesDB;