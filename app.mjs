// app.mjs
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';
import expresshbs from 'express-handlebars';

const app = express();

const RTScore = mongoose.model('RTScore');

// configure templating to hbs
app.set('view engine', 'hbs');

var hbs = expresshbs.create({});

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// for debugging 
function loggingMiddleware(req, res, next) {
	/*
    console.log('Method: ' + req.method);
    console.log('Path: ' + req.path);
    console.log(req.query);
	*/
    next();
}

app.use(loggingMiddleware);

// homepage 
app.get('/', (req, res) => {

    console.log('got a get request to /');

    res.render('landing');

});

/*
// send current state to unity games requesting it
app.get('/unitydata', (req, res) => {
    
    console.log('got a get request to /unitydata');

    //TODO send back the current state 

    res.render('stats'); 

});*/

//TODO can add authRequired like app.post('/article/add', authRequired, async (req, res) => {
// recieve a click from unity games 
app.post('/submitscore', async (req, res) => {

    console.log('got a post request to /submitscore');

    //post will look like this: 
    /* "{ \"name\": " + name + 
    ", \"levelName\": " + levelName + 
    ", \"levelTimeInMillis\": " + levelTimeInMillis + 
    ", \"bossTimeInMillis\": " + bossTimeInMillis +
    ", \"totalTimeInMillis\": " + totalTimeInMillis +
    ", \"momentRecorded\": " + momentRecorded +
    ", \"steamId\": " + steamId +
    ", \"eventName\": " + eventName + 
    
    name: String,           // player name 
    levelName: String,      // name of scene in unity 
    levelTime: Number,      // in milliseconds, time from start of level to entering boss arena
    bossTime: Number,       // in milliseconds, time from entering boss arena to boss defeated
    totalTime: Number,      // levelTime + bossTime 
    momentRecorded: Date,   // time and date this score was achieved, UTC
    steamId: String,        // steamID if using steam, defaults to '0' if not 
    eventName: String       // name of exhibition if applicable, null if none
    
    */

    const response = {
        status: "",
        err: "",
        eventValidation: ""
    }

    //TODO enforce & sanitize input 

    // name/callsign: enforce 3 capital letters
    var name = req.body.name;
    //TODO

    // level name: not enforced to allow for custom/workshop levels 
    var levelName = req.body.levelName;
    //TODO

    // level time, boss time, total time: we convert these to the js time format
    var levelTime = req.body.levelTimeInMillis;
    var bossTime = req.body.bossTimeInMillis;
    var totalTime = req.body.totalTimeInMillis;
    //TODO
    
    // moment recorded: we convert this to the js date format 
    var momentRecorded = req.body.momentRecorded;
    //TODO

    // steamid: 
    var steamId = req.body.steamId;
    //TODO

    // event name: we enforce if an event is going on at this time and the score can be uploaded.
    var eventName = req.body.eventName;
    if(req.body.eventName == null) {
        response.eventValidation = "NONE_PROVIDED";
    } else {
        //TODO 
    }
    //TODO 

    const score = new RTScore({
        name: name,
        levelName: levelName,
        levelTime: levelTime,
        bossTime: bossTime,
        totalTime: totalTime,
        momentRecorded: momentRecorded,
        steamId: steamId,
        eventName: eventName
    });

    try {
        await score.save();
        response.status = "success";
    } catch(err) {
        response.err = err.message;
        if(err instanceof mongoose.Error.ValidationError) {
            response.status = "validation error";
        } else {
            response.status = "error";
            res.send(response);
            throw err;
        }
    }

    res.send(response);

    //TODO could send a more organized response with more information 
    // eventValidated: NONE_PROVIDED / OK / EVENT_DOES_NOT_EXIST / TIME_OUT_OF_RANGE
    // event: "" / "Score submitted under event leaderboard!" / "Event does not exist in database! Score submitted, but not to this event." / "This event is not currently running! Score submitted, but not to this event."

});

// display stats to someone viewing the webpage
app.get('/leaderboard', (req, res) => {

    console.log('got a get request to /leaderboard');

    //TODO get the data from the database

    /*
    var scores = ???
    if('callsign' in req.query) {
        var searchTerm = req.query.callsign;
        if(searchTerm.length > 0) {
            scores = scoreData.filter(score => score.name.includes(searchTerm));
        }
    }

    res.render('list', {scores: scores});*/

    /*
    var p = //TOOD pull the object from the database 
    p.then((stats) => {

        res.render('stats', {stats: stats});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('server error');
    });*/


    //TODO we'll want to be able to filter and sort 
    // filter by event and version of the game, maybe these appear as tabs 
    // sort by best time

    res.render('leaderboard');

});

app.listen(process.env.PORT || 3000);

console.log("Server started; type CTRL+C to shut down");