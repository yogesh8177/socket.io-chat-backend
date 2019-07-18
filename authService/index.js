const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
//import { Users } from './models/users';
let Users = require('./models/users').Users;
const migrate = require('./boot/migration').migrate;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Auth Service Running..'));

app.post('/sign-up', async (req, res) => {
    try {
        let user = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password
        };
        let users = new Users();
        let result = await users.signUp(user);
        return res.status(200).send({message: 'User sign up successful', result});
    }
    catch(error) {
        return res.status(500).send({message: 'Internal Server Error', error});
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

(async() => {
    await migrate();
})().catch(error => console.error(error));

