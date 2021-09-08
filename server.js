/*
(+) Tharindu - START
Credits to: https://github.com/passport/express-4.x-local-example
(+) Tharindu - FINISH 
*/

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
//(+)Tharindu - START
var opn = require('opn');
var http = require('http');
var path = require('path');
var request = require('request');

//Prepartion for the API request:
var request = require('request');
var options = {
  'method': 'POST',
  'url': '<You have to mention the URL here>',
  'headers': {
    'x-api-key': '<You have to mention your API Key>',
    'Content-Type': 'text/plain'
  },
  body: "<You have to mention your request body here>"

};
//(+)Tharindu - FINISH


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Create a new Express application.
var app = express();

//(+)Tharindu - START
app.set('port', process.env.PORT || 4000);
//(+)Tharindu - FINISH

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//(+)Tharindu - START
//Reference: https://www.quora.com/How-do-I-call-an-image-from-the-existing-folder-using-Node-JS-and-display-on-the-front-end
var publicDir = require('path').join(__dirname,'/public'); 
app.use(express.static(publicDir));
//(+)Tharindu - FINISH

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
	 //(-/+)Tharindu - START	 
	 //	res.render('profile', { user: req.user });
	 request(options, function (error, response) {
		if (error) throw new Error(error);
			console.log(response.body);
});
	 //(-/+)Tharindu - FINISH    
  });

// Create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
