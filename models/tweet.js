var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var tweetUserSchemaMixin = {
    name: { type: String, required: true },
    pseudo: { type: String, required: true }, // screen name
    imageUrl: { type: String, required: true }
};

var tweetSchema = new Schema({
    twitterData: {
        id: { type: String, required: true},
        text : { type: String, required: true },
        user: tweetUserSchemaMixin,
        createdAt: { type: Date, required: true },
        entities: {},
        retweet: {}
    },
    metadata: {
        read: { type: Boolean, default: false },
        interesting: { type: Boolean, default: false },
        to_read_later: { type: Boolean, default: false },
        retweeted: { type: Boolean, default: false }
    }
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
