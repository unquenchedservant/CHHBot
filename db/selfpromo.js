const Database = require('./database');

class SelfPromoMsgDB extends Database {
	constructor() {
		super();
		this.create(0);
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS selfpromomsg
            (msgID INTEGER NOT NULL)`);
	}

	async add(msg_id) {
		await this.execute(`INSERT INTO selfpromomsg (msgID) VALUES (${msg_id})`);
	}

	async check(msg_id) {
		const data = await this.execute(`SELECT * FROM selfpromomsg WHERE msgID=${msg_id}`);
		return this.checkLen(data);
	}
}

module.exports = SelfPromoMsgDB;
