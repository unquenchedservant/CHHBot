const logger = require('../utility/logger');
const Database = require('./database');

class ArchivalDB extends Database {
  constructor() {
    super();
    this.create();
  }

  async create() {
    logger.info('checking/creating archive table');
    await this.execute(`CREATE TABLE IF NOT EXISTS archival
            (CHANNELID TEXT NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            LEVEL INTEGER NOT NULL)`);
  }

  async getChannels(month, day) {
    logger.info('Getting channel ids from Archive table');
    const data = await this.execute(
      'SELECT CHANNELID FROM archival WHERE MONTH = ? AND DAY = ?',
		  [month, day],
    );
    return data.length == 0 ? false : true;
  }

  async getLevel(channelId) {
    logger.info('Getting archive level from Archive table');
    const data = await this.execute(
      'SELECT LEVEL FROM archival WHERE CHANNELID = ?',
      [channelId],
    );
    return data.length == 0 ? false : data;
  }

  async check(channelId) {
    logger.info('Checking if channel id is in Archive table');
    return await this.execute(
      'SELECT * FROM archival WHERE CHANNELID= ? ',
      [channelId],
    );
  }

  async set(channelId, month, day, level) {
    logger.info(`Inserting ${channelId} to be archived on ${month}/${day} at level : ${level}`);
    await this.execute(
      'INSERT INTO archival (CHANNELID, MONTH, DAY, LEVEL) VALUES (?, ?, ?, ?)',
      [channelId, month, day, level]);
  }

  async update(channelId, { level = null, month = null, day = null }) {
    logger.info('Updating archive table');
    if (level) {
      logger.info(`Updating archive level for ${channelId} to ${level}`);
      await this.execute('UPDATE archival SET LEVEL = ? WHERE CHANNELID = ?', [level, channelId]);
    }
    if (month) {
      logger.info(`Updating archive month for ${channelId} to ${month}`);
      await this.execute('UPDATE archival SET MONTH = ? WHERE CHANNELID = ?', [month, channelId]);
    }
    if (day) {
      logger.info(`Updating archive day for ${channelId} to ${day}`);
      await this.execute('UPDATE archival set DAY = ? WHERE CHANNELID = ?', [day, channelId]);
    }
  }

  async remove(channelId) {
    logger.info(`Removing ${channelId} from archival table`);
    await this.execute('DELETE FROM archival WHERE CHANNELID = ?', [channelId]);
  }

  async drop() {
    logger.warn('Archival table dropped');
    await this.execute('DROP TABLE archival');
  }

}

module.exports = ArchivalDB;