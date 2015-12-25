var express = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    auth            = require('./routes/auth'),
    user			= require('./routes/user'),
    trips        	= require('./routes/trips'),
    checks          = require('./routes/checks'),
    app = express();

var jsonfile = require('jsonfile')
var file = '/tmp/data.json'


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());      // simulate DELETE and PUT

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function (req, res, next) {
    // jsonfile.writeFile(file, req, function (err) {
    //   console.error(err)
    // });
    console.log(req.headers);
    //console.log(req.body);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/login', auth.login);
app.post('/logout', auth.logout);

app.get('/user', user.getInfo);

app.get('/trips', trips.findAll);
app.get('/trips/:id', trips.findById);

app.get('/checks', checks.findAll);
app.get('/checks/:id', checks.findById);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});