// app.mjs
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';

const app = express();

const RTScore = mongoose.model('RTScore');

// configure templating to hbs
app.set('view engine', 'hbs');

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

function loggingMiddleware(req, res, next) {
    console.log('Method: ' + req.method);
    console.log('Path: ' + req.path);
    console.log(req.query);
    next();
}
app.use(loggingMiddleware);

// homepage 
app.get('/', (req, res) => {

    console.log('got a get request to /');

    res.render('home');

});

/*
// send current state to unity games requesting it
app.get('/unitydata', (req, res) => {
    
    console.log('got a get request to /unitydata');

    //TODO send back the current state 

    res.render('stats'); 

});*/

// recieve a click from unity games 
app.post('/submitscore', (req, res) => {

    console.log('got a post request to /submitscore');

    //post will look like this: 
    /* "{ \"name\": " + name + 
    ", \"levelName\": " + levelName + 
    ", \"levelTimeInMillis\": " + levelTimeInMillis + 
    ", \"bossTimeInMillis\": " + bossTimeInMillis +
    ", \"totalTimeInMillis\": " + totalTimeInMillis +
    ", \"momentRecorded\": " + momentRecorded +
    ", \"steamId\": " + steamId +
    ", \"eventName\": " + eventName + */

    //TODO 

});

// display stats to someone viewing the webpage
app.get('/leaderboard', (req, res) => {

    console.log('got a get request to /leaderboard');

    //TODO get the data from the database

    /*
    var p = //TOOD pull the object from the database 
    p.then((stats) => {

        res.render('stats', {stats: stats});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('server error');
    });*/

});


app.listen(process.env.PORT || 3000);

console.log("Server started; type CTRL+C to shut down");