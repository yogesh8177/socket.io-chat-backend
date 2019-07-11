const express = require('express');
const app = express();
const port = 3001;
import { Users } from './models/users';


app.get('/', (req, res) => res.send('Auth Service Running..'));

app.get('/sign-up', (req, res) => {
    try {
        let user = {
            name: req.body.name,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password
        };
        let users = new Users();
        let result = await users.signUp(user);
        return res.status(200).send({message: 'User sign up successful'});
    }
    catch(error) {
        return res.status(500).send({error: 'Internal Server Error'});
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));