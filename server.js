var express = require('express')
    , http = require('http')
    , mongoose = require('mongoose');

var tweets = require('./routes/tweets')
    , Config = require('./config')
    , Worker = require('./worker');

mongoose.connect(Config.mongodb.url);


var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 5000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(allowCrossDomain);

    // simple authentication
    app.use(passwordAuthenticate);

    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/tweets', tweets.index);
app.put('/tweets', tweets.update);



//CORS middleware
function allowCrossDomain (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');

    next();
};

function passwordAuthenticate (req, res, next) {
    if (req.query && req.query.auth_token===Config.auth.token) {
        console.log("authentified");
        next();
    }
    else {
        console.log("auth error !");
        console.log(req.query);
        res.send(401, "not authentified");
    }
}


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port %s in %s mode.",
        app.get('port'), app.settings.env);
});


Worker.register();



