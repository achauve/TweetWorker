var Tweet = require('../models/tweet');

exports.index = function(req, res) {
    Tweet.find()
        .sort('-twitterData.createdAt')
        .exec(function (err, docs) {
            if(!err) {
                res.json(200, docs);
            } else {
                res.json(500, { message: err });
            }
        });
}

exports.update = function(req, res) {
    console.log("update tweets");

    var _id = req.body._id;
    var read = req.body.metadata.read;

    Tweet.findById(_id, function(err, doc) {
        if(!err && doc) {
            doc.metadata.read = read;
            doc.save(function(err) {
                if(!err) {
                    res.json(200, {message: "Tweet updated"});
                } else {
                    res.json(500, {message: "Could not update tweet. " +
                        err});
                }
            });
        } else if(!err) {
            res.json(404, { message: "Could not find tweet."});
        } else {
            res.json(500, { message: "Could not update tweet. " +
                err});
        }
    });
}


