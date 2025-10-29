const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { isDev } = require('./environment');

class Logger {
  constructor() {
    const fileName = isDev() ? 'chhbot-dev.log' : 'chhbot.log';
    const logDir = process.env.LOG_DIR || '/mnt/logs';
    this.logFile = path.join(logDir, fileName);
    this.queue = [];
    this.isWriting = false;

    if (!fsSync.existsSync(logDir)) {
      try {
        fsSync.mkdirSync(logDir, { recursive: true });
      } catch (error){
        console.error(`Unable to create log directory at ${logDir}:`, error);
        process.exit(1);
      }
    }
  }

  async _writeLog(level, message) {
    const timestamp = new Date().toISOString();
    const botName = isDev() ? 'CHHBOT_DEV' : 'CHHBOT_PROD';
    const logEntry = `${timestamp} - ${botName} - ${level} - ${message}`;
    console.log(logEntry);
    this.queue.push(logEntry);
    if(!this.isWriting){
      this._flushQueue();
    }
  }

  async _flushQueue(){
    if (this.queue.length === 0){
      this.isWriting = false;
      return;
    }
    this.isWriting = true;
    const entry = this.queue.splice(0,100);

    try {
      await fs.appendFile(this.logFile, entry.join(''));
    }catch (err){
      console.error('Failed to write log entry:', err);
    }

    setImmediate(() => this._flushQueue());
  }

  info(message) { this._writeLog('INFO', message); }

  error(message) { this._writeLog('ERROR', message); }

  warn(message) { this._writeLog('WARNING', message); }

  debug(message) { this._writeLog('DEBUG', message); }
}

module.exports = new Logger();
