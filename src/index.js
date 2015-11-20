var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var util = require('util');
//var session = require('express-session');
var url = require('url');
var passport = require('passport');
var TwitchtvStrategy = require('passport-twitchtv').Strategy;
//var Rdio = require("rdio");
var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/MVCProject";

var db = mongoose.connect(dbURL, function(err) {
	if(err){
		console.log("Could not connect to database");
		throw err;
	}
});

var TWITCHTV_CLIENT_ID = "nc37ivmfuolr2gagm75n8zsuceljp86";
var TWITCHTV_CLIENT_SECRET = "lrvc22h0353cfwrf9y51fc9cmh4nssc";


var router = require('./router.js');

var port = process.env.PORT || process.env.NODE_PORT || 3000;
var profileThing;
var channelThing;
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitchtvStrategy({
    clientID: TWITCHTV_CLIENT_ID,
    clientSecret: TWITCHTV_CLIENT_SECRET,
    callbackURL: "https://gentle-bayou-4512.herokuapp.com/auth/twitchtv/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {

    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

//passport.use(new TwitchtvStrategy({
//    clientID: TWITCHTV_CLIENT_ID,
//    clientSecret: TWITCHTV_CLIENT_SECRET,
//    callbackURL: "http://localhost:3000/auth/twitchtv/callback",
//    scope: "channel_read"
//  },
//  function(accessToken, refreshToken, channel, done) {
//
//    process.nextTick(function () {
//        
//      return done(null, channel);
//    });
//    channelThing = channel;
//  }
//));


var app = express();

app.use('/assets', express.static(path.resolve(__dirname+'../../client/')));
app.use(compression());

app.use(bodyParser.urlencoded({
		extended: true
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(favicon(__dirname + '/../client/img/favicon.png'));
app.disable('x-powered-by');
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

router(app);

app.listen(port, function(err){
	if(err) {
		throw err;
	}
	console.log('Listening on port ' + port);
});