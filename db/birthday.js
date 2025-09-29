const logger = require('../utility/logger');
const Database = require('./database');

class BirthdayDB extends Database {
    constructor() {
        super();
        this.create();
    }

    async create() {
        await this.execute(`CREATE TABLE IF NOT EXISTS birthdays
            (USERID INTEGER NOT NULL,
            MONTH INTEGER NOT NULL,
            DAY INTEGER NOT NULL,
            ACTIVE INTEGER NOT NULL)`)
    }

    async get(user_id){
        logger.info(`User id for get ${user_id}`)
        let data = await this.execute(`SELECT * FROM birthdays WHERE USERID=${user_id}`)
        return data.length === 0
        ? [0,0]
        : data[0]
    }

    async get_multi(){
        let data = await this.execute(`SELECT USERID FROM birthdays`)
        return data.map(item => item.USERID);
    }

    async set(user_id, month, day){
        let data = await this.execute(`SELECT * FROM birthdays WHERE USERID=${user_id}`)
        let sql = data.length === 0
        ? `INSERT INTO birthdays (USERID, MONTH, DAY, ACTIVE) VALUES (${user_id}, ${month}, ${day}, ${1})`
        : `UPDATE birthdays SET MONTH=${month}, DAY=${day}, ACTIVE=${1} WHERE USERID=${user_id}`
        await this.execute(sql)
    }

    async set_active(is_active, user_id){
        let isactive_int = is_active ? 1 : 0
        await this.execute(`UPDATE birthdays SET ACTIVE=${isactive_int} WHERE USERID=${user_id}`) 
    }

    async check(month,day){
        let data = await this.execute(`SELECT USERID, ACTIVE FROM birthdays WHERE MONTH=${month} AND DAY=${day}`)
        let birthday_ids = []
        for (const birthday of data) {
            if (birthday[1] === 1 || birthday[1] === null){
                birthday_ids.push(birthday.USERID)
            }
        }
        return birthday_ids
    }

    async remove(user_id){
        await this.execute(`DELETE FROM birthdays WHERE USERID=${user_id}`)
    }
}

module.exports = BirthdayDB;