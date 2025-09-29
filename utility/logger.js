const fs = require('fs');
const path = require('path');
const { is_dev } = require('./utils');

class Logger {
    constructor(){
        const fileName = is_dev ? "chhbot-dev.log" : "chhbot.log"
        this.logFile = path.join('/mnt/logs', fileName);

        const logDir = path.join(__dirname, '..', 'logs');

        if(!fs.existsSync('/mnt/logs')){
            try{
               fs.mkdirSync('/mnt/logs', { recursive: true }) 
            } catch (error){
                console.error("Unable to create logs directory.")
                process.exit(1);
            }
        }
        try{
            fs.accessSync('/mnt/logs', fs.constants.W_OK)
        } catch (error) {
            console.error('No write permission to /mnt/logs:', error)
            process.exit(1);
        }
    }

    _writeLog(level, message){
        const timestamp = new Date().toISOString();
        const botName = is_dev ? "CHHBOT_DEV" : "CHHBOT_PROD"
        const logEntry = `${timestamp} - ${botName} - ${level} - ${message}`
        fs.appendFileSync(this.logFile, logEntry)
        console.log(logEntry);
    }

    info(message){
        this._writeLog('INFO', message)
    }

    error(message){
        this._writeLog('ERROR', message)
    }

    warn(message){
        this._writeLog('WARNING', message)
    }
    
    debug(message){
        this._writeLog('DEBUG', message)
    }
}

module.exports = new Logger();
