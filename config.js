module.exports = {
    auth: {
        token: process.env.AUTH_TOKEN
    },
    twitter: {
        consumer_key:           process.env.TWITTER_CONSUMER_KEY
        , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
        , access_token:         process.env.TWITTER_ACCESS_TOKEN
        , access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
    mongodb: {
        url: process.env.MONGOLAB_URI
    }
};