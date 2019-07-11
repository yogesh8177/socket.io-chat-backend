let mysql = require('mysql');

class Database {
    #connection;

    constructor(){
        this.#connection = mysql.createConnection({
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD
        });
    }
    // static function to get connection object
    static create() {
        if (this.database) return this.database;
        this.database = new Database();
        console.log('Created a new database object');
        return this.database;
    }

    async query(query, params) {
        return Promise.resolve()
                .then(() => {
                    this.#connection.beginTransaction(err => {
                        if (err) return Promise.reject(error);
                        this.#connection.query(query, params, (err, result) => {
                            if (err) {
                                console.error('error in transaction', JSON.stringify(err, null, 2));
                                this.#connection.rollback();
                                return Promise.reject(err);
                            }
                            return Promise.resolve(result);
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
                    this.#connection.commit(err => {
                        if (err) return Promise.reject(err);

                        this.#connection.release();
                        return Promise.resolve();
                    });
                })
                .catch(error => {
                    console.error('error while commiting transaction or releasing connection', JSON.stringify(err, null, 2));
                });
    }
}

export default Database;