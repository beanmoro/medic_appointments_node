import path from 'path';
import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {engine } from 'express-handlebars';
import lodash from 'lodash';

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = import.meta.dirname;

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

const users = [];

async function getRandomUsers( n_users = 1){

    try {
        const response = await axios.get(`https://randomuser.me/api/?results=${n_users}`);
        return response.data.results
    } catch (error) {
        console.log(error);
    }
    
}


async function registerUsers(){
    const randomUsers = await getRandomUsers(10);
    
    randomUsers.forEach( d => {
        const u = {
            first: d.name.first,
            last: d.name.last,
            gender: d.gender,
            id: uuidv4(),
            timestamp: moment().locale('es').format('Qo MMMM YYYY HH:mm:ss')
        }
        users.push(u);
    })
}

app.get('/', async (req, res) => {
    await registerUsers()
    const newUsers = lodash.partition(users, (item) => item.gender === 'female');
    return res.render('users', { femaleUsers: newUsers[0], maleUsers: newUsers[1]});
});



app.listen(PORT, () =>{
    console.log(`Server Listening on http://localhost:${PORT}`)
})