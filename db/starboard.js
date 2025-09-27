const Database = require('../db/database');

class StarboardSettingsDB extends Database {
    constructor() {
        super();
        this.create();
    }

    async create() {
        await this.execute(`CREATE TABLE IF NOT EXISTS starboardsettings
            (GUILDID INTEGER NOT NULL,
            STARBOARDCHANNEL INTEGER NOT NULL,
            STARBOARDTHRESHOLD INTEGER NOT NULL)`);
    }

    async add(guildId, starboardChannel, starboardThreshold){
        await this.execute(`INSERT INTO starboardsettings
            (GUILDID, STARBOARDCHANNEL, STARBOARDTHRESHOLD)
            VALUES (${guildId}, ${starboardChannel}, ${starboardThreshold})`);
    }

    async check(guildId) {
        const data = await this.execute(`SELECT * FROM starboardsettings WHERE GUILDID=${guildId}`);
        return this.checkLen(data);
    }

    async updateChannel(guildId, starboardChannel){
        console.log(`UPDATE CHANNEL ID: ${starboardChannel}`)
        await this.execute(`UPDATE starboardsettings
            SET STARBOARDCHANNEL=${starboardChannel}
            WHERE GUILDID=${guildId}`);
    }

    async updateThreshold(guildId, starboardThreshold) {
        await this.execute(`UPDATE starboardsettings
            SET STARBOARDTHRESHOLD=${starboardThreshold}
            WHERE GUILDID=${guildId}`);
    }

    async getSettings(guildId){
        const data = await this.execute(`SELECT STARBOARDCHANNEL, STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=${guildId}`);
        return data[0];
    }

    async getThreshold(guildId){
        const data = await this.execute(`SELECT STARBOARDTHRESHOLD
            FROM starboardsettings WHERE GUILDID=${guildId}`);
        return data[0].STARBOARDTHRESHOLD;
    }

    async getChannel(guildId){
        const data = await this.execute(`SELECT STARBOARDCHANNEL
            FROM starboardsettings WHERE GUILDID=${guildId}`);
        console.dir(data[0], {depth: null});
        console.log(`DATA IS ${data[0].STARBOARDCHANNEL.toString()}`)
        return data[0].STARBOARDCHANNEL.toString();
    }

    async remove(guildId){
        await this.execute(`DELETE FROM starboardsettings WHERE GUILDID=${guildId}`);
    }

    async drop() {
        await this.execute('DROP TABLE starboardsettings');
    }
}

module.exports = {
    StarboardSettingsDB
};