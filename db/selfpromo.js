const logger = require('../utility/logger');
const Database = require('./database');

class SelfPromoMsgDB extends Database {
	constructor() {
		super();
		this.create(0);
	}

	async create() {
		logger.info('Checking/creating selfpromomsg table');
		await this.execute(`CREATE TABLE IF NOT EXISTS selfpromomsg
            (msgID TEXT NOT NULL)`);
	}

	async add(msg_id) {
		logger.info(`Adding msg ID #${msg_id} to the selfpromomsg table`);
		await this.execute(`INSERT INTO selfpromomsg (msgID) VALUES (${msg_id})`);
	}

	async check(msg_id) {
		logger.info(`Checking if msg ID #${msg_id} is on the selfpromomsg table`);
		const data = await this.execute(`SELECT * FROM selfpromomsg WHERE msgID=${msg_id}`);
		return this.checkLen(data);
	}

}

module.exports = SelfPromoMsgDB;
