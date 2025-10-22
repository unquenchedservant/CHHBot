/* eslint-disable no-empty-function */
const sqlite3 = require('sqlite3').verbose();
const logger = require('../utility/logger');

class Database {
  async execute(query, params = []) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('chh.db', (openErr) => {
        if (openErr) {
          logger.error(`Failed to open DB: ${openErr}`);
          return reject(openErr);
        }

        const trimmed = query.trim().toUpperCase();
        if (trimmed.startsWith('SELECT')) {
          db.all(query, params, (err, rows) => {
            if (err) {
              logger.error(`Database error: ${err}`);
              db.close(() => {});
              return reject(err);
            }
            db.close((closeErr) => {
              if (closeErr) logger.error(`Error closing DB: ${closeErr}`);
              resolve(rows);
            });
          });
        }
        else {
          db.run(query, params, function(err) {
            if (err) {
              logger.error(`Database Error: ${err}`);
              db.close(() => {});
              return reject(err);
            }
            const result = { lastID: this.lastID, changes: this.changes };
            db.close((closeErr) => {
              if (closeErr) logger.error(`Error closing DB: ${closeErr}`);
              resolve(result);
            });
          });
        }
      });
    });
  }

  checkLen(data) {
    return data.length > 0;
  }
}

module.exports = Database;