const Promise = require('bluebird');
let Database = require('../db/mySQLDatabase').Database;
let models = [];
models.push(require('../models/users').Users.getModelInstance());

async function migrate () {
    let db = Database.create();
    console.log('Starting migration...');
    return Promise.mapSeries(
        models,
        model => {
            return model.migration(db);
        }
    )
    .then(responseArray => {
        console.log('Migration complete!', responseArray);
        return db.complete();
    })
    .catch(error => {
        console.error('Error while migration', error);
        return Promise.reject(error);
    });
}

exports.migrate = migrate;