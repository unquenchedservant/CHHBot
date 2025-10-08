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

  async add(msgID) {
    logger.info(`Adding msg ID #${msgID} to the selfpromomsg table`);
    await this.execute(`INSERT INTO selfpromomsg (msgID) VALUES (${msgID})`);
  }

  async check(msgID) {
    logger.info(`Checking if msg ID #${msgID} is on the selfpromomsg table`);
    const data = await this.execute(`SELECT * FROM selfpromomsg WHERE msgID=${msgID}`);
    return this.checkLen(data);
  }

}

module.exports = SelfPromoMsgDB;
