/* eslint-disable no-empty-function */
const sqlite3 = require('sqlite3').verbose();
const logger = require('../utility/logger');

class Database {
  constructor() {
    this.db = null;
  }

  async connect() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database('chh.db', (err) => {
        if (err) {
          logger.error(`Failed to connect to database: ${err}`);
          reject(err);
        } else {
          logger.info('Connected to database');
          this.db.run('PRAGMA journal_mode = WAL');
          resolve(this.db)
        }
      });
    });
  }

  async execute(query, params = []) {
    const db = await this.connect();

    return new Promise((resolve, reject) => {
      const trimmed = query.trim().toUpperCase();
      if (trimmed.startsWith('SELECT')) {
        db.all(query, params, (err, rows) => {
          if (err) {
            logger.error(`Database error: ${err}`);
            return reject(err);
          }
          resolve(rows);
        });
      }
      else {
        db.run(query, params, function(err) {
          if (err) {
            logger.error(`Database Error: ${err}`);
            return reject(err);
          }
          resolve({ lastID: this.lastID, changes: this.changes })
        });
      }
    });
  }

  async close() {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) {
            logger.error(`Failed to close database: ${err}`);
            return reject(err);
          }
          // ensure we clear the reference so future connect() will recreate it
          this.db = null;
          logger.info('Database connection closed');
          resolve();
        });
      });
    }
  }

  checkLen(data) {
    return data.length > 0;
  }
}

module.exports = new Database();