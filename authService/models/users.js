const bcrypt = require('bcrypt');
import { Database } from './db/mySQLDatabase';
const saltRounds = 12;

class Users {
    constructor() {}

    async signUp(user) {
        return Promise.resolve()
                .then(() => {
                    bcrypt.hash(user.password, saltRounds, (err, hash) => {
                        if (err) {
                            console.error('error while hashing password', JSON.stringify(err));
                            return Promise.reject(err);
                        }
                        user.password = hash;
                        return Promise.resolve(user);
                    });
                })
                .then(user => {
                    let db = new Database();
                    let result = await db.query('INSERT INTO users SET ?', user);
                })
                .catch(error => {
                    console.error('error while sign up', JSON.stringify(error, null, 2));
                    Promise.reject(error);
                });
    }

    async migrateUp (db) {
        // we can use a config file to update the schema and build the table based on it
        // but for now, hardcoded fields will do the job.
        return db.query(`CREATE TABLE IF NOT EXISTS users (
                        user_id INT NOT NULL, 
                        PRIMARY KEY user_id (user_id), 
                        name VARCHAR(255),
                        email VARCHAR(255),
                        accountVerified BOOL,
                        access_token TEXT,
                        refresh_token TEXT,
                        createdAt DATE,
                        updatedAt DATE
                    )`,
                    []
                );
    }

    async migrateDown (db) {
        return db.query(`DROP TABLE IF EXISTS users`, []);
    }

    async migration () {
        try {
            let db = new Database();
            let resultForDown = await this.migrateDown(db);
            let resultForUp = await this.migrateUp(db);
            return Promise.resolve();
        }
        catch(error) {
            console.error('Error while migration', JSON.stringify(error, null, 2));
            return Promise.reject(error);
        }
    }
}

export default Users;