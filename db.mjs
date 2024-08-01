import mongoose from 'mongoose';

const RTScoreSchema = new mongoose.Schema({
    gameVersion: String,    // version/build of game (e.g. if levels are updated)
    name: String,           // player name 
    levelName: String,      // name of scene in unity 
    levelTime: Number,      // in milliseconds, time from start of level to entering boss arena
    bossTime: Number,       // in milliseconds, time from entering boss arena to boss defeated
    totalTime: Number,      // levelTime + bossTime 
    momentRecorded: Date,   // time and date this score was achieved, UTC
    steamId: String,        // steamID if using steam, defaults to '0' if not 
    contact: String       	// for events with prizes 
});
const RTScore = mongoose.model('RTScore', RTScoreSchema);

const RTEventSchema = new mongoose.Schema({
    name: String,
    dateBegins: Date,
    dateEnds: Date
});
const RTEvent = mongoose.model('RTEvent', RTEventSchema);

console.log('Waiting for connection to database...')
try {
  await mongoose.connect('mongodb://127.0.0.1:27017/rope-tool-database', {useNewUrlParser: true});
  console.log('Successfully connected to database.')
} catch (err) {
  console.log('ERROR: ', err);
}