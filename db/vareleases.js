const db = require('./database');
const logger = require('../utility/logger');

class VAReleasesDB {

  async create() {
    logger.info('Checking/creating vareleases table');
    await db.execute(`CREATE TABLE IF NOT EXISTS vareleases
            (ID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserID TEXT NOT NULL,
            UserName VARCHAR(100) NOT NULL,
            ReleaseTitle VARCHAR(100) NOT NULL,
            ReleaseDate VARCHAR(12) NOT NULL,
            Desc VARCHAR(300) NOT NULL,
            Type VARCHAR(10) NOT NULL,
            Link VARCHAR(200) NOT NULL)`);
  }

  async add(userId, userName, releaseTitle, releaseDate, desc, type, link) {

    await this.execute(`INSERT INTO vareleases 
            (UserID, UserName, ReleaseTitle, ReleaseDate, Desc, Type, Link) 
            VALUES 
            ("${userId}","${userName}","${releaseTitle}","${releaseDate}","${desc}","${type}","${link}")`);
    const data = await this.execute(`SELECT ID FROM vareleases 
            WHERE 
            UserID="${userId}" AND UserName="${userName}" AND ReleaseTitle="${releaseTitle}" AND ReleaseDate="${releaseDate}" AND Desc="${desc}" AND Type="${type}" AND Link="${link}"`);
    logger.info(`${userName} added a new release ID #${data[0].ID}, title: ${releaseTitle}, date: ${releaseDate}, desc: ${desc}, type: ${type}, link: ${link} to the vareleases table`);
    return data[0].ID;
  }

  async getUserByID(ID) {
    logger.info(`Getting userID connected to release ID #${ID} in the vareleases table`);
    const data = await this.execute(`SELECT UserID FROM vareleases WHERE ID=${ID}`);
    return data;
  }

  async getByID(ID) {
    logger.info(`Getting the release at ID #${ID} on the vareleases table`);
    const data = await this.execute(`SELECT * FROM vareleases WHERE ID=${ID}`);
    return data;
  }

  async getByUser(userId) {
    logger.info(`Getting all releases for user ID #${userId} from vareleases table`);
    const data = await this.execute(`SELECT * FROM vareleases WHERE UserID=${userId}`);
    return data;
  }

  async getByDate(date) {
    logger.info(`Getting all releases releasing on ${date} from vareleases table`);
    const data = await this.execute(`SELECT * FROM vareleases WHERE ReleaseDate="${date}"`);
    return data;
  }

  async check(ID) {
    logger.info(`Checking that ID #${ID} exists in the vareleases table`);
    const data = await getUserByID(ID);
    return db.checkLen(data);
  }

  async delete(ID) {
    logger.info(`Removing release ID #${ID} from vareleases table`);
    await this.execute(`DELETE FROM vareleases WHERE ID=${ID}`);
  }

  async update(ID, releaseTitle = '', releaseDate = '', desc = '', rType = '', link = '') {
    if (!releaseTitle == '') {
      logger.info(`Updated title on release ID #${ID} to ${releaseTitle} in the vareleases table`);
      await this.execute(`UPDATE vareleases SET ReleaseTitle="${releaseTitle}" WHERE ID=${ID}`);
    }
    if (!releaseDate == '') {
      logger.info(`Updated release date on release ID #${ID} to ${releaseDate} in the vareleases table`);
      await this.execute(`UPDATE vareleases SET ReleaseDate="${releaseDate}" WHERE ID=${ID}`);
    }
    if (!desc == '') {
      logger.info(`Updated desc on release ID #${ID} to ${desc} in vareleases table`);
      await this.execute(`UPDATE vareleases SET Desc="${desc}" WHERE ID=${ID}`);
    }
    if (!rType == '') {
      logger.info(`Updated type on release ID #${ID} to ${rType} in vareleases table`);
      await this.execute(`UPDATE vareleases SET TYPE="${rType}" WHERE ID=${ID}`);
    }
    if (!link == '') {
      logger.info(`Updated link on release ID #${ID} to ${link} in vareleases table`);
      await this.execute(`UPDATE vareleases SET LINK="${link}" WHERE ID=${ID}`);
    }
  }
}

module.exports = VAReleasesDB;