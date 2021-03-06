var compression = require('compression');
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
// compress all requests
app.use(compression())

// API Documentation: http://expressjs.com/4x/api.html#router
// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4
// http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// always invoked
// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	// console.log('Something is happening.');
	console.log('%s %s %s', req.method, req.url, req.path);
	next(); // make sure we go to the next routes and don't stop here
});

// home page route (http://localhost:5000)
router.get('/', function(req, res) {
	res.sendfile('index.html');
});

// http://stackoverflow.com/questions/23860275/javascript-angular-not-loading-when-using-express
//add this so the browser can GET the bower files
//app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/dist'));

// apply the routes to our application
app.use('/', router);

// Error-handling middleware 
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
