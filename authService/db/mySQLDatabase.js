let mysql = require('mysql');

class Database {

    constructor(){
        this.connection = mysql.createConnection({
            host     : process.env.MYSQL_HOST,
            database : process.env.MYSQL_DATABASE,
            user     : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD
        });
        console.log(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD)
    }
    // static function to get connection object
    static create() {
        if (this.database) return this.database;
        this.database = new Database();
        console.log('Created a new database object');
        return this.database;
    }

    async query(query, params) {
        //return Promise.resolve('yes');
        return Promise.resolve()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        this.connection.beginTransaction(err => {
                            if (err) return reject(err);
                            this.connection.query(query, params, (err, result) => {
                                if (err) {
                                    this.connection.rollback();
                                    return reject(err);
                                }
                                return resolve(result);
                            });
                        });
                    });
                })
                .catch(error => {
                    console.log('error while querying', JSON.stringify(error, null, 2));
                    return Promise.reject(error);
                });
    }

    async complete() {
        return Promise.resolve()
                .then(() => {
                    this.connection.commit(err => {
                        if (err) return Promise.reject(err);
                        //this.connection.close();
                        return Promise.resolve();
                    });
                })
                .catch(error => {
                    console.error('error while commiting transaction or releasing connection', JSON.stringify(err, null, 2));
                });
    }
}

exports.Database = Database;