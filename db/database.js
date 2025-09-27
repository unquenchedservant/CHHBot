const sqlite3 = require('sqlite3').verbose()

class Database {
    constructor(){
        this.conn = null;
    }

    async execute(query) {
        return new Promise((resolve, reject) => {
            try { 
                this.conn = new sqlite3.Database('chh.db');
                this.conn.all(query, [], (err,rows)=>{
                    if(err){
                        console.error(err);
                        reject(err);
                    }
                    this.conn.close();
                    resolve(rows);
                });
            } catch (err) {
                console.err(err);
                reject(err);
            }
        });
    }

    checkLen(data) {
        return data.length !== 0;
    }

    close() {
        if (this.conn) this.conn.close();
    }
}

module.exports = Database;