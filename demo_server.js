
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , cfenv = require('cfenv')
//  , user = require('./routes/user')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , logframe = require('./routes/logframe')
  , streams = require('./routes/streams')
  , path = require('path')
  , iotConfig = require('./iotconfig.json');

// MongoDB
//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/legodemo');

// MQTT client
var mqttClient = require('ibmiotf').IotfApplication;
var mqttAppClient = new mqttClient(iotConfig);


var app = express();
var appEnv = cfenv.getAppEnv();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PlotlyClient = require('./lib/PlotlyClient');
var pClient;

// all environments
//app.set('port', 3000);
//app.set('port', appEnv.port || 3000);
app.set('port', appEnv.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/semantic', express.static(path.join(__dirname, 'semantic/dist')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// DB connection for the router
app.use(function(req, res, next) {
	req.db = db;
	next();
})


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/logframe', logframe.frame);
app.get('/streams', streams.streamlist);

//app.get('/users', user.list);

// Initialize the Plotly client...
try {
	pClient = new PlotlyClient();
}
catch(err) {
	console.log("Error while initializing Plotly:\n" + err.stack);
}

// Connect MQTT client
mqttAppClient.connect();

mqttAppClient.on('connect', function () {	// Subscription...
	mqttAppClient.subscribeToDeviceEvents();
});

// Socket.IO client

io.on('connection', function (socket) {

	// Get streams...
	var streams = pClient.getStreams();

	console.log('These stream events are known: ' + pClient.getEvents().toString());

	// Generate an 'event' for each Plotly stream, identified by the 'name' parameter defined in the config
	streams.forEach(function (stream) {
		socket.on(stream.name, function(data) {
			stream.send(data);
		});
	});

	// Broadcast console message
	socket.on('console', function (msg) {
		console.log(msg);
		io.emit('console message', msg);
	});
});

// MQTT Event handlers...
mqttAppClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {

	var streams = pClient.getStreams();

	streams.forEach(function (stream) {
		if(stream.name === 'stream1') {
			stream.send(payload);
		}
	});

	if(eventType === 'console') {
		io.emit('console message', payload)
	}
});

http.listen(app.get('port'), function (){
  console.log('Express server listening on port ' + app.get('port'));
});
