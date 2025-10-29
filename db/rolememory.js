const logger = require('../utility/logger');
const db = require('./database');

class RoleMemoryDB{
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating roleMemory table');
    await db.execute(`CREATE TABLE IF NOT EXISTS roleMemory
            (GUILDID TEXT NOT NULL,
            ENABLED INT NOT NULL)`);
  }

  async check(guildID) {
    logger.info('Checking if role memory is enabled in the roleMemory table');
    const data = await db.execute('SELECT * FROM roleMemory WHERE GUILDID=?', [guildID]);
    if (data) {
      return data[0].ENABLED;
    }
    else {
      return 0;
    }
  }

  async toggle(guildID) {
    logger.info(`Toggling role memory for ${guildID} in the roleMemory table`);
    const data = await db.execute('SELECT * FROM roleMemory WHERE GUILDID=?', [guildID]);
    let newEnabled = 1;
    if (data.length !== 0) {
      newEnabled = data[0].ENABLED == 0 ? 1 : 0;
      await db.execute('UPDATE roleMemory SET ENABLED=? WHERE GUILDID=?', [newEnabled, guildID]);
    }
    else {
      await db.execute('INSERT INTO roleMemory (GUILDID, ENABLED) VALUES (?, 1)', guildID);
    }
  }

  async get(guildID) {
    logger.info(`Getting roleMemory status for ${guildID} from the roleMemory table`);
    const data = await db.execute('SELECT * FROM roleMemory WHERE GUILDID=?', [guildID]);
    return data.length == 0 ? true : false;
  }
}

class RoleDB{
  constructor() {
    this.create();
  }
  async create() {
    logger.info('Checking/creating roles table');
    await db.execute(`CREATE TABLE IF NOT EXISTS roles
            (UID INT NOT NULL,
            RID INT NOT NULL)`);
  }

  async add(userID, roleID) {
    logger.info(`Adding role ID #${roleID} for user ID #${userID} in the roles table`);
    await db.execute('INSERT INTO roles (UID, RID) VALUES (?, ?)', [userID, roleID]);
  }

  async get(userID) {
    logger.info(`Getting user ID #${userID}'s roles`);
    const data = await db.execute('SELECT * FROM roles WHERE UID=?', [userID]);
    const roles = [];
    for (const row of data) {
      roles.push(row[1]);
    }
    return roles;
  }

  async remove(userID) {
    logger.info(`Removing roles from user ID #${userID}`);
    await db.execute('DELETE FROM roles WHERE UID=?', [userID]);
  }
}

module.exports = { 
  roleDB: new RoleDB(),
  roleMemoryDB: new RoleMemoryDB() 
};