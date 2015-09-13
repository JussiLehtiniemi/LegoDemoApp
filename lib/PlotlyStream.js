/**
 * Stream instance for plotly
 */

function PlotlyStream(Plotly, config, callback) {

	var self = this;

	self.config = config;
	self.name = config.name;
	self.stream = undefined;

	console.log(this.config);

	var data = {
			x: [],		// Empty set as this will be streamed
			y: [],		// Same as x
			type: self.config.type,
			mode: self.config.mode,
			marker: self.config.marker,
			line: self.config.line,
			stream: {
				'token': self.config.streamToken,
				'maxpoints': self.config.maxPoints
			}
	};
	
	var layout = {
			"filename": self.config.fileName,
			"fileopt": self.config.fileOpt,
			"layout": self.config.layout,
			"world_readable": true
	};
	
	// Initialize Plotly data stream
	Plotly.plot(data, layout, function(err, res) {
		if(err) throw err;

		self.stream = Plotly.stream(self.config.streamToken, function() {});

		console.log(self.stream);

		self.stream.on("error", function() {
			console.log("Error with stream!");
		});

		return callback(self);
	});

}

function initPlotlyStream(plotly, token, callback) {

	console.log("Now trying to create stream " + token);

	var stream = plotly.stream(token, function(res) {

		console.log("Response from plotly stream:\n" + res);

		console.log(stream);
		return callback(stream);
	});
}

PlotlyStream.prototype.setKeepAlive = function() {

	var self = this;

	var KeepAlive = require(__dirname + '/KeepAlive');

	self.keepAliveTime = Date.now();
	self.keepAliveTimer = new KeepAlive(this);
};

PlotlyStream.prototype.send = function(data) {

	var self = this;

	if(typeof data == "string") {
		console.log("Sending String: " + data);
		self.stream.write(data);
		self.keepAliveTime = Date.now();		// Refresh keepalive timestamp
	}
	else {
		var streamData = JSON.stringify(data);
		console.log("Sending JSON: " + streamData);
		self.stream.write(streamData + "\n");
		self.keepAliveTime = Date.now();		// Refresh keepalive timestamp
	}
};

PlotlyStream.prototype.close = function() {

	var self = this;

	clearInterval(self.keepAliveTimer.getTimer());
	self.stream.close();
};

PlotlyStream.prototype.toString = function() {
	return "Stream: " + this.name + " Token: " + this.config.streamToken;
};

module.exports = PlotlyStream;