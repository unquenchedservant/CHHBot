const logger = require('../utility/logger');
const db = require('./database');

class SelfPromoMsgDB {
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating selfpromomsg table');
    await db.execute(`CREATE TABLE IF NOT EXISTS selfpromomsg
            (msgID TEXT NOT NULL)`);
  }

  async add(msgID) {
    logger.info(`Adding msg ID #${msgID} to the selfpromomsg table`);
    await db.execute('INSERT INTO selfpromomsg (msgID) VALUES (?)', [msgID]);
  }

  async check(msgID) {
    logger.info(`Checking if msg ID #${msgID} is on the selfpromomsg table`);
    const data = await db.execute('SELECT * FROM selfpromomsg WHERE msgID=?', [msgID]);
    return db.checkLen(data);
  }

}

module.exports = new SelfPromoMsgDB();
