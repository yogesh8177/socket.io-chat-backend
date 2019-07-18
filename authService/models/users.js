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
        let db = Database.create();
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

    async fetchUsers (limit, page) {
        let db = Database.create();
        let resultSet = await db.query(`SELECT * from users LIMIT ${limit * page}, ${limit}`);
        await db.complete();
        return Promise.resolve(resultSet);
    }
}

exports.Users = Users;