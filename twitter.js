//-------- twitter client config
var Twit = require('twit');
var Config = require('./config');


module.exports = new Twit(Config.twitter);