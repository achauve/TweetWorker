var Tweet = require('../models/tweet');
var TwitterService = require('../twitter');

exports.index = function(req, res) {
    var query = Tweet.find();

    if (req.query.read) {
        query = query.where('metadata.read', req.query.read);
    }

    query = query
        .sort('-twitterData.createdAt')
        .limit(100);

    query.exec(function (err, docs) {
        if (err) {
            res.json(500, { message: err });
            return;
        }
        res.json(200, docs);
    });
};


function saveTweet (tweet, res) {
    tweet.save(function(err) {
        if (err) {
            res.json(500, {message: "Could not update tweet. " +
                err});
            return;
        }

        res.json(200, {message: "Tweet updated"});
    });
}


function handleInternalError(res, msg) {
    console.log("ERROR: " + msg);
    res.json(500, {message: msg});
}

exports.create = function(req, res) {
    console.log("create new tweet");

    var text = req.body.text;

    TwitterService.post('statuses/update', { status: text }, function (err, reply) {
        if (err) {
            handleInternalError(res, "Could not post new tweet on twitter api. " + err);
            console.log(err);
            return;
        }
        console.log("posted new tweet successfully");
    });
};


exports.update = function(req, res) {
    console.log("update tweet");

    var _id = req.body._id;
    var metadata = req.body.metadata;

    Tweet.findById(_id, function(err, doc) {
        if (err) {
            handleInternalError(res, "Could not update tweet. " + err);
            return;
        }

        if (!doc) {
            res.json(404, { message: "Could not find tweet."});
            return;
        }

        to_retweet = !doc.metadata.retweeted && metadata.retweeted;
        doc.metadata = metadata;

        console.log("to_retweet=" + to_retweet);

        console.log("updating tweet _id=" + doc._id);

        if (to_retweet) {
            var tweetId = doc.twitterData.retweet ? doc.twitterData.retweet.id : doc.twitterData.id;
            console.log("trying to retweet tweet id=" + tweetId);
            TwitterService.post('statuses/retweet/:id', { id: tweetId }, function (err, reply) {
                if (err) {
                    handleInternalError(res, "Could not retweet on twitter api. " + err);
                    console.log(err);
                    return;
                }
                console.log("retweeted tweet successfully");
                saveTweet(doc, res);
            });
        }
        else {
            saveTweet(doc, res);
        }
    });
};

