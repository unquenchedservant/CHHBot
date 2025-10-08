const logger = require('../utility/logger');
const Database = require('./database');

class BirthdayDB extends Database {
  constructor() {
    super();
    this.create();
  }

  async create() {
    logger.info('Checking/creating birthdays table');
    await this.execute(`CREATE TABLE IF NOT EXISTS birthdays
            (USERID TEXT NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            ACTIVE INTEGER NOT NULL)`);
  }

  async get(userId) {
    logger.info(`Getting birthdays for ${userId} from birthdays table`);
    const data = await this.execute(`SELECT * FROM birthdays WHERE USERID=${userId}`);
    return data.length === 0
      ? [0, 0]
      : data[0];
  }

  async getMulti() {
    logger.info('Getting all birthdays');
    const data = await this.execute('SELECT USERID FROM birthdays');
    return data.map(item => item.USERID);
  }

  async set(userID, month, day) {
    logger.info(`Setting ${userID}'s birthday to ${month}/${day}`);
    const data = await this.execute(`SELECT * FROM birthdays WHERE USERID=${userID}`);
    const sql = data.length === 0
      ? `INSERT INTO birthdays (USERID, MONTH, DAY, ACTIVE) VALUES (${userID}, ${month}, ${day}, ${1})`
      : `UPDATE birthdays SET MONTH=${month}, DAY=${day}, ACTIVE=${1} WHERE USERID=${userID}`;
    await this.execute(sql);
  }

  async setActive(isActive, userID) {
    logger.info('Toggling active in birthdays table');
    const isActiveInt = isActive ? 1 : 0;
    await this.execute(`UPDATE birthdays SET ACTIVE=${isActiveInt} WHERE USERID=${userID}`);
  }

  async check(month, day) {
    logger.info(`Checking if any birthdays on ${month}/${day}`);
    const data = await this.execute(`SELECT USERID, ACTIVE FROM birthdays WHERE MONTH=${month} AND DAY=${day}`);
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
    await this.execute(`DELETE FROM birthdays WHERE USERID=${userID}`);
  }
}

module.exports = BirthdayDB;