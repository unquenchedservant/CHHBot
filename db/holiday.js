const logger = require('../utility/logger');
const db = require('./database');

class HolidayDB{
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating holidays table');
    await db.execute(`CREATE TABLE IF NOT EXISTS holidays
                        (MONTH INT NOT NULL,
                        DAY INT NOT NULL,
                        MSG VARCHAR(2000) NOT NULL)`);
  }

  async add(month, day, msg) {
    let updated = false;
    let sql = '';
    let params = []
    const data = await db.execute('SELECT * FROM holidays WHERE MONTH=? AND DAY=?', [month, day]);
    if (data) {
      logger.info(`Adding holiday on ${month}/${day} with ${msg} to holidays table`);
      sql = `INSERT INTO holidays (MONTH, DAY, MSG) VALUES (?, ?, '?')`;
      params = [month, day, msg];
    }
    else {
      updated = true;
      logger.info(`Updated holiday on ${month}/${day} with ${msg} to holidays table`);
      sql = 'UPDATE holidays SET MSG=\'?\' WHERE MONTH=? AND DAY=?';
      params = [msg, month, day];
    }
    await db.execute(sql, params);
    return updated;
  }

  async check(month, day) {
    logger.info(`Checking for holiday on ${month}/${day}`);
    const data = await db.execute('SELECT MSG FROM holidays WHERE MONTH=? AND DAY=?', [month, day]);
    if (!db.checkLen(data)) {
      return 0;
    }
    else {
      return data[0].MSG;
    }
  }

  async checkMulti() {
    logger.info('Getting all holidays');
    return await db.execute('SELECT * FROM holidays');
  }

  async remove(month, day) {
    logger.info(`Removing holiday on ${month}/${day} from the holidays table`);
    const data = await db.execute('SELECT * FROM holidays WHERE MONTH=? AND DAY=?', [month, day]);
    if (data.length == 0) {
      return 0;
    }
    else {
      await db.execute('DELETE FROM holidays WHERE MONTH=? AND DAY=?', [month, day]);
      return 1;
    }
  }
}

module.exports = new HolidayDB();