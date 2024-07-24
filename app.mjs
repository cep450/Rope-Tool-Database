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

//TODO can add authRequired like app.post('/article/add', authRequired, async (req, res) => {
// recieve a click from unity games 
app.post('/submitscore', async (req, res) => {

    console.log('got a post request to /submitscore');
    console.log('the request was' + JSON.stringify(req.body));

    if(req.body.secret != process.env.SECRET) {
        res.status(401).send("Unauthorized!");
        return;
    }
    
    /* 
    incoming data:
    gameVersion
    "{ \"name\": " + name + 
    ", \"levelName\": " + levelName + 
    ", \"levelTimeInMillis\": " + levelTimeInMillis + 
    ", \"bossTimeInMillis\": " + bossTimeInMillis +
    ", \"totalTimeInMillis\": " + totalTimeInMillis +
    ", \"momentRecorded\": " + momentRecorded +
    ", \"steamId\": " + steamId +
    ", \"eventName\": " + eventName + 
    plus a secret
    
    database:
    gameVersion: String
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

    //enforce & sanitize input 

    //TODO general sanitization

    // game version: 
    var gameVersion = req.body.gameVersion;

    // name/callsign: enforce 3 capital letters
    var name = req.body.name;
    name = name.toUpperCase();
    name = name.substring(0,3);
    //TODO enforce letters no numbers or special symbols 

    // level name: not enforced to allow for custom/workshop levels 
    var levelName = req.body.levelName;
    //TODO do we want to limit to a # of characters?

    // level time, boss time, total time: we convert these to the js time format
    var levelTime = req.body.levelTimeInMillis;
    var bossTime = req.body.bossTimeInMillis;
    var totalTime = req.body.totalTimeInMillis;
    
    // moment recorded: automatically converted to the js date format
    var momentRecorded = req.body.momentRecorded;

    // steamid: 
    var steamId = req.body.steamId;
    //TODO check if there's any other data via SteamWorks we can use 

    // event name: we enforce if an event is going on at this time and the score can be uploaded.
    var eventName = req.body.eventName;
    if(req.body.eventName == null) {
        response.eventValidation = "NONE_PROVIDED";
    } else {
        //TODO 
        // eventValidated: NONE_PROVIDED / OK / EVENT_DOES_NOT_EXIST / TIME_OUT_OF_RANGE
        // event: "" / "Score submitted under event leaderboard!" / "Event does not exist in database! Score submitted, but not to this event." / "This event is not currently running! Score submitted, but not to this event."
    }

    const score = new RTScore({
        gameVersion: gameVersion,
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

});

// display stats to someone viewing the webpage
app.get('/leaderboard', (req, res) => {

    console.log('got a get request to /leaderboard');

    //get the data from the database
    const p = RTScore.find();
    p.then((scores) => {

        //TODO searching/filtering 
        // filter by: callsign, event, level, game version
        // sort by: best time, date uploaded 
        /*
        if('callsign' in req.query) {
            var searchTerm = req.query.callsign;
            if(searchTerm.length > 0) {
                scores = scoreData.filter(score => score.name.includes(searchTerm));
            }
        }
        */

        const formattedScores = new Array(scores.length);

        //format the data 
        scores.forEach((score, index, array) => {
            formattedScores[index] = {
                gameVersion: score.gameVersion,
                name: score.name,
                levelName: score.levelName,
                levelTime: new Date(array[index].levelTime).toISOString().slice(14,23),
                bossTime: new Date(array[index].levelTime).toISOString().slice(14,23),
                totalTime: new Date(array[index].levelTime).toISOString().slice(14,23),
                momentRecorded: score.momentRecorded.toISOString().slice(0,10),
                steamId: null, //TODO we would convert between the steamid and the username here 
                eventName: score.eventName
            }
        });

        res.render('leaderboard', {scores: formattedScores});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('server error');
    });
    
});

/*
// TODO send current state to unity games requesting it
// TODO we could probably put some of the leaderboard stuff into functions to reuse for this
app.get('/unitydata', (req, res) => {
    
    console.log('got a get request to /unitydata');

    //TODO send back the current state  

});*/

app.listen(process.env.PORT || 3000);

console.log("Server started; type CTRL+C to shut down");