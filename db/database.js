const sqlite3 = require('sqlite3').verbose();
const logger = require('../utility/logger');

class Database {
  constructor() {
    this.conn = null;
  }

  async execute(query, params = []) {
    return new Promise((resolve, reject) => {
      try {
        this.conn = new sqlite3.Database('chh.db');
        this.conn.all(query, params, (err, rows) => {
          if (err) {
            logger.error(`Database error: ${err}`);
            reject(err);
          }
          this.conn.close();
          resolve(rows);
        });
      }
      catch (err) {
        console.err(err);
        reject(err);
      }
    });
  }

  checkLen(data) {
    return data.length > 0;
  }

  close() {
    if (this.conn) this.conn.close();
  }
}

module.exports = Database;