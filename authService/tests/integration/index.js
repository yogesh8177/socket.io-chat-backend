const app = require('../../index').app;
const chai = require('chai');
const request = require('supertest');
const Promise = require('bluebird');

const expect = chai.expect;

before(function(done) {
    app.on('migration-complete', () => done());
    this.timeout(10000);
});

describe(`Auth api tests`, () => {

    it(`Should fetch 2 seeded users`, function (done) {
        let limit = 2, page = 0;
        this.timeout(10000);
        return Promise.delay(2000)
            .then(() => request(app)
                .get('/fetch-users')
                .query({limit, page})
            )
            .then(response => {
                expect(response.statusCode).to.equal(200);
                expect(response.body.usersList).to.be.an('array');
                expect(response.body.usersList).to.have.length(limit);
                done();
            })
            .catch(error => done(error));   
    });

    it(`Should signup a new user`, function (done) {
        let user = {
            id: 3,
            name: 'Rambo',
            email: 'rambo@gmail.com',
            mobileNumber: 9090909090,
            password: 'qwerty123'
        };
        request(app)
        .post('/sign-up')
        .send(user)
        .then(response => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal('User sign up successful');
            done();
        })
        .catch(error => done(error));
    });

    it(`Should fetch 2 seeded users plus 1 user that we registered in above test`, function(done) {
        let limit = 3, page = 0;
        this.timeout(10000);
        return Promise.delay(2000)
            .then(() => request(app)
                .get('/fetch-users')
                .query({limit, page})
            )
            .then(response => {
                expect(response.statusCode).to.equal(200);
                expect(response.body.usersList).to.be.an('array');
                expect(response.body.usersList).to.have.length(limit);
                done();
            })
            .catch(error => done(error));   
    });
});