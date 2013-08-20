var Tweet = require('../models/tweet');
var TwitterService = require('../twitter');

exports.index = function(req, res) {
    Tweet.find()
        .sort('-twitterData.createdAt')
        .exec(function (err, docs) {
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
            console.log("trying to retweet tweet id=" + doc.twitterData.id);
            TwitterService.post('statuses/retweet/' + doc.twitterData.id, function (err, reply) {
                if (err) {
                    handleInternalError(res, "Could not retweet on twitter api. " + err);
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

