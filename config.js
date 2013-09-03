// Generated by LiveScript 1.2.0
(function(){
  var fs, ref$, map, lines, split, pairsToObj, readIniFile, currentEnv, get;
  fs = require('fs');
  ref$ = require('prelude-ls'), map = ref$.map, lines = ref$.lines, split = ref$.split, pairsToObj = ref$.pairsToObj;
  readIniFile = function(filename){
    var data, res;
    data = fs.readFileSync(filename, 'utf8');
    return res = pairsToObj(
    map(function(s){
      return split('=')(
      s);
    })(
    lines(
    data)));
  };
  currentEnv = readIniFile('.env');
  get = function(key){
    if (process.env[key]) {
      return process.env[key];
    } else {
      return currentEnv[key];
    }
  };
  module.exports = {
    auth: {
      token: get('AUTH_TOKEN')
    },
    twitter: {
      consumer_key: get('TWITTER_CONSUMER_KEY'),
      consumer_secret: get('TWITTER_CONSUMER_SECRET'),
      access_token: get('TWITTER_ACCESS_TOKEN'),
      access_token_secret: get('TWITTER_ACCESS_TOKEN_SECRET')
    },
    mongo: {
      url: get('MONGOLAB_URI')
    }
  };
}).call(this);
