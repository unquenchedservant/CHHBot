const Database = require('./database');

class HolidayDB extends Database {
    constructor() {
        super();
        this.create();
    }

    async create() {
        await this.execute(`CREATE TABLE IF NOT EXISTS holidays
                        (MONTH INT NOT NULL,
                        DAY INT NOT NULL,
                        MSG VARCHAR(2000) NOT NULL)`);
    }

    async add(month, day, msg) {
        let updated = false
        let sql = ""
        const data = await this.execute(`SELECT * FROM holidays WHERE MONTH=${month} AND DAY=${day}`);
        if (data.length == 0){
            sql = `INSERT INTO holidays (MONTH, DAY, MSG) VALUES (${month}, ${day}, '${msg}')`
        }else{
            updated = true
            sql = `UPDATE holidays SET MSG='${msg}' WHERE MONTH=${month} AND DAY=${day}`
        }
        await this.execute(sql)
        return updated;
    }

    async check(month,day){
        const data = await this.execute(`SELECT MSG FROM holidays WHERE MONTH=${month} AND DAY=${day}`)
        if (data.length == 0){
            return 0;
        }else{
            return data[0].MSG;
        }
    }

    async check_multi(){
        return await this.execute("SELECT * FROM holidays");
    }

    async remove(month,day){
        const data = await this.execute(`SELECT * FROM holidays WHERE MONTH=${month} AND DAY=${day}`);
        if (data.length == 0){
            return 0;
        }else{
            await this.execute(`DELETE FROM holidays WHERE MONTH=${month} AND DAY=${day}`);
            return 1;
        }
    }
}

module.exports = HolidayDB;