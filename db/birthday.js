const logger = require('../utility/logger');
const db = require('./database');

class BirthdayDB {

  async create() {
    logger.info('Checking/creating birthdays table');
    await db.execute(`CREATE TABLE IF NOT EXISTS birthdays
            (USERID TEXT NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            ACTIVE INTEGER NOT NULL)`);
  }

  async get(userId) {
    logger.info(`Getting birthdays for ${userId} from birthdays table`);
    const data = await db.execute('SELECT * FROM birthdays WHERE USERID = ?', [userID]);
    return data.length === 0
      ? [0, 0]
      : data[0];
  }

  async getMulti() {
    logger.info('Getting all birthdays');
    const data = await db.execute('SELECT USERID FROM birthdays');
    return data.map(item => item.USERID);
  }

  async set(userID, month, day) {
    logger.info(`Setting ${userID}'s birthday to ${month}/${day}`);
    const data = await db.execute('SELECT * FROM birthdays WHERE USERID = ?', [userID]);
    const { sql, params } = data.length === 0
      ? { sql: 'INSERT INTO birthdays (USERID, MONTH, DAY, ACTIVE) VALUES (?, ?, ?, 1)', params: [userID, month, day] }
      : { sql: 'UPDATE birthdays SET MONTH=${month}, DAY=${day}, ACTIVE=1 WHERE USERID=${userID}', params: [month, day, userID] };
    await db.execute(sql, params);
  }

  async setActive(isActive, userID) {
    logger.info('Toggling active in birthdays table');
    const isActiveInt = isActive ? 1 : 0;
    await db.execute('UPDATE birthdays SET ACTIVE = ? WHERE USERID = ?', [isActiveInt, userID]);
  }

  async check(month, day) {
    logger.info('Checking if any birthdays on ${month}/${day}');
    const data = await db.execute('SELECT USERID, ACTIVE FROM birthdays WHERE MONTH=? AND DAY=?', [month, day]);
    const birthdayIDs = [];
    if (data) {
      for (const birthday of data) {
        if (birthday.ACTIVE === 1 || birthday.ACTIVE === null) {
          birthdayIDs.push(birthday.USERID);
        }
      }
    }
    return birthdayIDs;
  }

  async remove(userID) {
    logger.info(`Removing ${userID}'s birthday`);
    await db.execute('DELETE FROM birthdays WHERE USERID=?', [userID]);
  }
}

module.exports = new BirthdayDB();
