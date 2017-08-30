var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var Twitter = require('twitter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mydb";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.createCollection("tweets", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});


var client = new Twitter({
    consumer_key: 'yOTtNuIyaEBGT825culpz6ZQ8',
    consumer_secret: 'lNahQ7OXdn4yoKG2eSLxbOtDcipg9IJ9YBdKeysBbiErdk2uzg',
    access_token_key: '3772433354-EwlnWXPKJGAoSwefwrIA7jVPNppXgV1bzHFUyr2',
    access_token_secret: 'g6j4OlJG5HaKSkD87WDjvUM3GBWJWbAM8sGWHnn67CwAn'
});
client.stream('statuses/filter', {track: 'blockchain bitcoin'}, function(stream) {
    stream.on('data', function(event) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            event._id=event.id_str;
            console.log(event._id +" "+event.id_str);
            db.collection("twitter").insertOne(event, function(err, res) {
                if (err) throw err;
              //  console.log("1 document inserted");
                db.close();
            });
        });
      //  console.log(event && event.text);
    });
    stream.on('error', function(error) {
        throw error;
    });
});

module.exports = app;
