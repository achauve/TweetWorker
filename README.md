TweetWorker
===========

Worker/Server that fetch tweets from twitter api, stores them and serves them with added custom metadata

Based on:
- nodejs stack, using express for rest api server
- fetches tweets from twitter api in a timer-based callback
- stores tweets and additional metadata in a MongoDB instance (MongoLab)
- can be deployed on Heroku
