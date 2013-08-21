var TwitterService = require('./twitter');

// MongoDB model
var Tweet = require('./models/tweet');


function getUserFromTweet(tweet) {
    return {
        name: tweet.user.name,
        pseudo: tweet.user.screen_name,
        imageUrl: tweet.user.profile_image_url
    }
}

function refreshTweets () {

    var lastTweetId = 1;

    Tweet.find()
        .sort('-twitterData.createdAt')
        .limit(1)
        .select('twitterData.id')
        .exec(function useTwitterId (err, data) {
            console.log("err: " + err);

            if (data.length > 0)
            {
                lastTweetId = data[0].twitterData.id;
            }


            console.log("last tweet id = " + lastTweetId);

            TwitterService.get('statuses/home_timeline', { since_id: lastTweetId, count: 200 }, function(err, reply) {
                console.log('twitter api call');
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("nb tweets: " + reply.length);

                reply.forEach(function(tweet) {
                    if (tweet.id != lastTweetId) {
                        id = tweet.id;
                        console.log("adding tweet id=" + id + " ; text=" + tweet.text);

                        retweet = tweet.retweeted_status;

                        var newTweet = new Tweet;
                        newTweet.twitterData = {
                            id: tweet.id_str,
                            text: retweet ? retweet.text : tweet.text,
                            user: getUserFromTweet(tweet),
                            createdAt: tweet.created_at,
                            entities: {
                                urls: retweet ? retweet.entities.urls : tweet.entities.urls
                            }
                        };

                        if (retweet)
                        {
                            newTweet.twitterData.retweet = {
                                createdAt: retweet.created_at,
                                user: getUserFromTweet(retweet),
                                id: retweet.id_str
                            };
                        }

                        newTweet.save(function(err) {
                            if(err) {
                                console.log("Could not create tweet. Error: " + err);
                            }
                        });
                    }
                    else {
                        console.log("skipping same id as lastTweetId: " + tweet.id + " ; text=" + tweet.text);
                    }
                });

            });
        });



};


var intervalId = 0;
var delayMs = 5*60*1000;

module.exports = {
    register: function () {
        intervalId = setInterval(refreshTweets, delayMs);
    },
    unregister: function () {
        clearInterval(intervalId);
    }
};
