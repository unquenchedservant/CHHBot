const Database = require('./database');

class SelfPromoMsgDB extends Database {
	constructor() {
		super();
		this.create(0);
	}

	async create() {
		await this.execute(`CREATE TABLE IF NOT EXISTS selfpromomsg
            (msgID TEXT NOT NULL)`);
	}

	async add(msg_id) {
		await this.execute(`INSERT INTO selfpromomsg (msgID) VALUES (${msg_id})`);
	}

	async check(msg_id) {
		const data = await this.execute(`SELECT * FROM selfpromomsg WHERE msgID=${msg_id}`);
		return this.checkLen(data);
	}

	async migrate() {
		await this.execute(`CREATE TABLE IF NOT EXISTS selfpromomsg_new
            (msgID TEXT NOT NULL)`);

		await this.execute(`INSERT INTO selfpromomsg_new
            SELECT CAST(msgID as TEXT) FROM selfpromomsg`);

		await this.execute('DROP TABLE selfpromomsg');

		await this.execute('ALTER TABLE selfpromomsg_new RENAME TO selfpromomsg');
	}
}

module.exports = SelfPromoMsgDB;
