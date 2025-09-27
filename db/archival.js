const Database = require('../db/database');

class ArchivalDB extends Database {
    constructor() {
        super();
        this.create();
    }

    async create(){
        await this.execute(`CREATE TABLE IF NOT EXISTS archival
            (CHANNELID INTEGER NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            LEVEL INTEGER NOT NULL)`)
    }

    async get_channels(month, day){
        let data = await this.execute(`SELECT CHANNELID FROM archival WHERE MONTH=${month} AND DAY=${day}`)
        return ch = data.length == 0 ? false : true
    }

    async get_level(channel_id){
        let data = await this.execute(`SELECT LEVEL FROM archival WHERE CHANNELID=${channel_id}`)
        return ch = data.length == 0 ? false : data
    }

    async check(channel_id){
        return await this.execute(`SELECT * FROM archival WHERE CHANNELID=${channel_id}`)
    }

    async set(channel_id, month, day, level){
        await this.execute(`INSERT INTO archival (CHANNELID, MONTH, DAY, LEVEL) VALUES (${channel_id}, ${month}, ${day}, ${level})`)
    }

    async update(channel_id, { level=null, month=null, day=null}){
        if (level && month && day){
            await this.execute(`UPDATE archival SET LEVEL=${level}, MONTH=${month}, DAY=${day} WHERE CHANNELID=${channel_id}`)
        }else if(level && month){
            await this.execute(`UPDATE archival SET LEVEL=${level}, MONTH=${month} WHERE CHANNELID=${channel_id}`)
        }else if(level){
            await this.execute(`UPDATE archival SET LEVEL=${level} WHERE CHANNELID=${channel_id}`)
        }else if(month){
            await this.execute(`UPDATE archival SET MONTH=${month} WHERE CHANNELID=${channel_id}`)
        }
    }

    async remove(channel_id){
        await self.execute(`DELETE FROM archival WHERE CHANNELID='${channel_id}'`)
    }
    
    async drop(){
        await self.execute("DROP TABLE archival")
    }
}