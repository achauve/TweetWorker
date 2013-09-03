###--- nodetime plugin
if process.env.NODETIME_ACCOUNT_KEY
then
    require 'nodetime' .profile do
        accountKey: process.env.NODETIME_ACCOUNT_KEY
        appName: 'TweetWorker'
###---

require! {
    express
    http
    mongoose
    \./config
}

console.log config

require! {
    \./routes/tweets
    \./config
    \./worker
}

process.on 'uncaughtException' (err) !->
  console.log 'Caught exception: ' err



mongoose.connect config.mongo.url

allowCrossDomain = (req, res, next) !->
    res.header 'Access-Control-Allow-Origin', '*'
    res.header 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'
    res.header 'Access-Control-Allow-Headers', 'Content-Type,X-Requested-With'
    next!

passwordAuthenticate = (req, res, next) !->
    if req.query and req.query.auth_token is config.auth.token then next!
    else
        console.log "auth error!"
        console.log req.query
        res.send 401, "not authenticated"

app = express!

app.configure !->
    app.set \port (process.env.PORT or 5000)
    app.use express.favicon!
    app.use express.logger \dev
    app.use express.bodyParser!
    app.use express.methodOverride!

    app.use allowCrossDomain

    # simple authentication
    app.use passwordAuthenticate

    app.use app.router


app.configure \development !->
    app.use express.errorHandler { dumpExceptions: true, showStack: true }


app.get \/tweets tweets.index
app.put \/tweets tweets.update
app.post \/tweets tweets.create

app.get \/ (req, res) !->
   res.json 200 {message: \authenticated }


http.createServer app .listen (app.get \port ), !->
    console.log "Express server listening on port %s in %s mode." (app.get \port), app.settings.env


worker.register!

