const app = require('../../index').app;
const chai = require('chai');
const request = require('supertest');

const expect = chai.expect;

describe(`Auth api tests`, () => {
    it(`Should fetch 2 seeded users`, done => {
        let limit = 2, page = 0;
        request(app)
        .get('/fetch-users')
        .query({limit, page})
        .then(response => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.usersList).to.be.an('array');
            expect(response.body.usersList).to.have.length(limit);
            done();
        })
        .catch(error => done(error));
    });

    it(`Should signup a new user`, done => {
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
});