
require! {
    fs
}
{map, lines, split, pairs-to-obj} = require 'prelude-ls'


readIniFile = (filename) ->
    data = fs.readFileSync filename, \utf8
    res = data
    |> lines
    |> map (s) -> s |> split '='
    |> pairs-to-obj

currentEnv = readIniFile \.env

get = (key) ->
    if process.env[key] then process.env[key]
    else currentEnv[key]


module.exports =
    auth:
        token: get \AUTH_TOKEN
    twitter:
        consumer_key:         get \TWITTER_CONSUMER_KEY
        consumer_secret:      get \TWITTER_CONSUMER_SECRET
        access_token:         get \TWITTER_ACCESS_TOKEN
        access_token_secret:  get \TWITTER_ACCESS_TOKEN_SECRET
    mongo:
        url: get \MONGOLAB_URI
