var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mydb";
/* GET home page. */
router.get('/', function (req, res, next) {
    var data = [];
    mongo.connect(url, function (err, db) {
        if (err) throw err;
        var tweets = db.collection('twitter').aggregate([
            {$group: {_id: "$user.screen_name", user: {$push: "$user"}, count: {$sum: 1}}},
            {$sort: {count: -1}},

        ]);
        tweets.forEach(function (result) {
            result.user = result.user[0];
            data.push(result);
        }, function () {
            db.close();
            res.render('welcome', {tweetData: data});
            //  console.log(data);
        });

    });
});
router.get('/get-data/', function (req, res, next) {
    var data = [];
    var user = req.params.name;

    mongo.connect(url, function (err, db) {
        if (err) throw err;
        var tweets = db.collection('twitter').find();
        tweets.forEach(function (doc, err) {
            if (err) throw err;
            data.push(doc);
            console.log(doc);
        }, function () {
            db.close();
            res.render('index', {tweets: data});
            //  console.log(data);
        });

    });
});
router.get('/get-data/:name', function (req, res, next) {
    var data = [];
    var user = req.params.name;
    mongo.connect(url, function (err, db) {
        if (err) throw err;
        console.log(user);
        var tweets = db.collection('twitter').find({"user.screen_name": user});
        tweets.forEach(function (doc, err) {
            if (err) throw err;
            data.push(doc);
            console.log(doc);


        }, function () {
            db.close();
            res.render('index', {tweets: data, name: user});
            //  console.log(data);
        });

    });
});


module.exports = router;
