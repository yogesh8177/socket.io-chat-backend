const bcrypt = require('bcrypt');
let Database = require('../db/mySQLDatabase').Database;
const saltRounds = 12;

class Users {
    constructor() {}

    static getModelInstance() {
        if (!this.modelInstance) {
            this.modelInstance = new Users();
            return this.modelInstance;
        }
        else {
            return this.modelInstance;
        }
    }

    async signUp(user) {
        let db = new Database();
        return Promise.resolve()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        bcrypt.hash(user.password, saltRounds, (err, hash) => {
                            if (err) {
                                console.error('error while hashing password', JSON.stringify(err));
                                return reject(err);
                            }
                            user.password = hash;
                            return resolve(user);
                        });
                    });
                })
                .then(user => db.query('INSERT INTO users SET ?', user))
                .then(result => db.complete())
                .catch(error => {
                    console.error('error while sign up', error);
                    return Promise.reject(error);
                });
    }

    async migrateUp (db) {
        // we can use a config file to update the schema and build the table based on it
        // but for now, hardcoded fields will do the job.
        console.log('creating table users');
        return db.query(`CREATE TABLE IF NOT EXISTS users (
                        id INT NOT NULL, 
                        PRIMARY KEY id (id), 
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        mobileNumber VARCHAR(50) UNIQUE,
                        password VARCHAR(300) NOT NULL,
                        accountVerified BOOL DEFAULT false,
                        access_token TEXT,
                        refresh_token TEXT,
                        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )`,
                    []
                );
    }

    async migrateDown (db) {
        try{ 
            console.log('dropping table users');
            let result = await db.query(`DROP TABLE IF EXISTS users`, []);
            console.log('Users migrate down result', result);
            return Promise.resolve(result);
        }
        catch(error) {
            console.error('Error while migrating Users table', JSON.stringify(error, null, 2));
        }   
    }

    async migration (db) {
        try {
            let resultForDown = await this.migrateDown(db);
            let resultForUp = await this.migrateUp(db);
            return Promise.resolve({resultForDown, resultForUp});
        }
        catch(error) {
            console.error('Error while migration in Users model', JSON.stringify(error, null, 2));
            return Promise.reject(error);
        }
    }
}

exports.Users = Users;