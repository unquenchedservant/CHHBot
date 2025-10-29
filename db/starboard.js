const db = require('./database');
const logger = require('../utility/logger');
class StarboardSettingsDB {
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating starboardsettings table');
    await db.execute(`CREATE TABLE IF NOT EXISTS starboardsettings
            (GUILDID TEXT NOT NULL,
            STARBOARDCHANNEL TEXT NOT NULL,
            STARBOARDTHRESHOLD INTEGER NOT NULL)`);
  }

  async add(guildId, starboardChannel, starboardThreshold) {
    logger.info(`Adding starboard channel ID #${starboardChannel} and threshold ${starboardThreshold} for ${guildId} in starboardsettings table`);
    await db.execute(`INSERT INTO starboardsettings
            (GUILDID, STARBOARDCHANNEL, STARBOARDTHRESHOLD)
            VALUES (?, ?, ?)`, [guildId, starboardChannel, starboardThreshold]);
  }

  async check(guildId) {
    logger.info(`Checking if starboard settings exist for ${guildId} in starboardsettings table`);
    const data = await db.execute('SELECT * FROM starboardsettings WHERE GUILDID=?', [guildId]);
    return db.checkLen(data);
  }

  async updateChannel(guildId, starboardChannel) {
    logger.info(`Setting starboard channel to ID #${starboardChannel} for guild ID #${guildId} in starboardsettings table`);
    await db.execute(`UPDATE starboardsettings
            SET STARBOARDCHANNEL=?
            WHERE GUILDID=?`, [starboardChannel, guildId]);
  }

  async updateThreshold(guildId, starboardThreshold) {
    logger.info(`Setting threshold to ${starboardThreshold} for guild ID #${guildId} in starboardsettings table`);
    await db.execute(`UPDATE starboardsettings
            SET STARBOARDTHRESHOLD=?
            WHERE GUILDID=?`, [starboardThreshold, guildId]);
  }

  async getSettings(guildId) {
    logger.info(`Getting settings for guild ID #${guildId} in starboardsettings table`);
    const data = await db.execute(`SELECT STARBOARDCHANNEL, STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=?`, [guildId]);
    return data[0];
  }

  async getThreshold(guildId) {
    logger.info(`Getting the threshold for guild ID #${guildId} in starboardsettings table`);
    const data = await db.execute(`SELECT STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=?`, [guildId]);
    return data[0].STARBOARDTHRESHOLD;
  }

  async getChannel(guildId) {
    logger.info(`Getting starboard channel for guild ID #${guildId} in starboardsettings table`);
    const data = await db.execute(`SELECT STARBOARDCHANNEL
            FROM starboardsettings WHERE GUILDID=?`, [guildId]);
    console.dir(data[0], { depth: null });
    console.log(`DATA IS ${data[0].STARBOARDCHANNEL.toString()}`);
    return data[0].STARBOARDCHANNEL.toString();
  }

  async remove(guildId) {
    logger.info(`Removing guild ID #${guildId} in the starboardsettings table`);
    await db.execute('DELETE FROM starboardsettings WHERE GUILDID=?', [guildId]);
  }

  async drop() {
    logger.warn('starboardsettings table dropped');
    await db.execute('DROP TABLE starboardsettings');
  }
}

class StarboardDB {
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating starboard table');
    await db.execute(`CREATE TABLE IF NOT EXISTS starboard
            (MSGID TEXT NOT NULL,
            STARBOARDMSGID TEXT NOT NULL)`);
  }

  async add(msgID, starboardMsgID) {
    logger.info(`Adding msg ID #${msgID} with starboard msg ID #${starboardMsgID} to starboard table`);
    await db.execute('INSERT INTO starboard (MSGID, STARBOARDMSGID) VALUES (?, ?)', [msgID, starboardMsgID]);
  }

  async get(msgID) {
    logger.info(`Getting msg ID #${msgID} from starboard table`);
    const data = await db.execute('SELECT STARBOARDMSGID FROM starboard WHERE MSGID=?', [msgID]);
    if (data) {
      return data[0].STARBOARDMSGID;
    }
    else {
      logger.info('No data on get');
      return 0;
    }
  }

  async update(msgID, starboardMsgID) {
    logger.info(`Updating starboard msg ID to #${starboardMsgID} for msg ID #${msgID} on the starboard table`);
    await db.execute('UPDATE starboard SET STARBOARDMSGID=? WHERE MSGID=?', [starboardMsgID, msgID]);
  }

  async check(msgID) {
    logger.info(`Checking if msg ID #${msgID} is on starboard table`);
    const data = await db.execute('SELECT * FROM starboard WHERE MSGID=?', [msgID]);
    return db.checkLen(data);
  }

  async remove(msgID) {
    logger.info(`Removing msg ID #${msgID} from starboard table`);
    await db.execute('DELETE FROM starboard WHERE MSGID=?', [msgID]);
  }

  async drop() {
    logger.warn('starboard table dropped');
    await db.execute('DROP TABLE starboard');
  }
}

class ModboardDB {
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating modboard table');
    await db.execute(`CREATE TABLE IF NOT EXISTS modboard
            (MSGID TEXT NOT NULL,
            MODBOARDMSGID TEXT NOT NULL)`);
  }

  async add(msgID, modboardMsgID) {
    logger.info(`Adding msg ID #${msgID} with modboard msg ID #${modboardMsgID} to modboard table`);
    await db.execute('INSERT INTO modboard (MSGID, MODBOARDMSGID) VALUES (?, ?)', [msgID, modboardMsgID]);
  }

  async check(msgID) {
    logger.info(`Checking if msg ID #${msgID} is on modboard table`);
    const data = await db.execute('SELECT * FROM modboard WHERE MSGID=?', [msgID]);
    return db.checkLen(data);
  }

  async get(msgID) {
    logger.info(`Getting msg ID #${msgID} from modboard table`);
    const data = await db.execute('SELECT * FROM modboard WHERE MSGID=?', [msgID]);
    return data[0].MODBOARDMSGID;
  }

  async update(msgID, modboardMsgID) {
    logger.info(`Updating modboard msg ID to #${modboardMsgID} for msg ID #${msgID} on the modboard table`);
    await db.execute('UPDATE modboard SET MODBOARDMSGID=? WHERE MSGID=?', [modboardMsgID, msgID]);
  }

  async remove(msgID) {
    logger.info(`Removing msg ID #${msgID} from modboard table`);
    await db.execute('DELETE FROM modboard WHERE MSGID=?', [msgID]);
  }

  async drop() {
    logger.warn('modboard table dropped');
    await db.execute('DROP TABLE modboard');
  }
}
module.exports = {
  starboardDB: new StarboardDB(),
  modboardDB: new ModboardDB(),
  starboardSettingsDB: new StarboardSettingsDB(),
};