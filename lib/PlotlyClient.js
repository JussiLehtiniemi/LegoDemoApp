/**
 * Client object that allows streaming data into the Plotly service
 * Supports also updating the data of static graphs
 */

function PlotlyClient(callback) {
	var fs = require('fs');
	var PlotlyStream = require(__dirname + '/PlotlyStream');

	var self = this;

	fs.readFile('./plotlyconfig.json', 'utf8', function(err, data) {
		if(err) throw err;

		self.config = JSON.parse(data);

		self.apiKey = self.config.plotlyApikey;
		self.userName = self.config.plotlyUsername;
		self.confDir = self.config.plotConfigDir;

		// Initialize Plotly
		var Plotly = require('plotly')(self.userName, self.apiKey);

		self.streams = [];
		self.events = [];

		// Initialize client
		fs.readdir(self.confDir, function(err, files) {
			if(err) throw err;

			for(var i=0; i < files.length; i++) {
				if(files[i].match(/^stream/)) {		// Stream plot configs should be named as stream*.json
					fs.readFile(self.confDir + "/" + files[i], 'utf8', function(err, data) {
						if(err) throw err;
						confObj = JSON.parse(data);

						// Create a plotly stream...
						try {
							var stream = new PlotlyStream(Plotly, confObj, function(stream) {
								stream.setKeepAlive();
								self.streams.push(stream);
								self.events.push(stream.name);
							});
						}
						catch(err) {
							console.log("Error initializing stream:\n" + err.stack)
						}
					});
				}
			}
		});
	});
}

PlotlyClient.prototype.getEvents = function() {
	return this.events;
};

PlotlyClient.prototype.getStreams = function() {
	return this.streams;
};

PlotlyClient.prototype.getStream = function(name) {
	for(var i=0; i < this.streams.length; i++) {
		if(this.streams[i].name === name) {
			return this.streams[i];
		}
	}
}

PlotlyClient.prototype.close = function() {
	for(var i=0; i<this.streams.length; i++) {
		var stream = this.streams[i];
		console.log("Closing stream: " + stream.toString());
		stream.close();
		console.log("Done!");
	}
};

module.exports = PlotlyClient;
