const fs = require('fs');
const Promise = require('bluebird');
let rawData = fs.readFileSync(`${__dirname}/seedData/userSeedData.json`);
let Users = require('../models/users').Users;
let jsonData = JSON.parse(rawData);
class UserMigration {
    constructor() {}

    static getModelInstance() {
        if (!this.modelInstance) {
            this.modelInstance = new UserMigration();
            return this.modelInstance;
        }
        else {
            return this.modelInstance;
        }
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

    async seedUsers (db) {
        let user = new Users();
        return Promise.mapSeries(
            jsonData,
            userPayload => {
                return user.signUp(userPayload);
            }
        )
        .then(responseArray => {
            console.log('Users seeded successfully');
            db.complete();
        })
        .catch(error => {
            console.error('Error while seeding users');
            return Promise.reject(error);
        });
    }

    async migration (db) {
        try {
            let resultForDown = await this.migrateDown(db);
            let resultForUp = await this.migrateUp(db);
            let resultForSeed = await this.seedUsers(db);
            return Promise.resolve({resultForDown, resultForUp, resultForSeed});
        }
        catch(error) {
            console.error('Error while migration in Users model', JSON.stringify(error, null, 2));
            return Promise.reject(error);
        }
    }
}

exports.UserMigration = UserMigration;