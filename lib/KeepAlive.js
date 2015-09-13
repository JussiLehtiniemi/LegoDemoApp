/**
 * KeepAlive timer for Plotly streams
 */

function KeepAlive(stream) {

	console.log("Starting KeepAlive timer for " + stream.toString());

	var cnt = 0;

	this.timer = setInterval(function() {

		var time = Date.now() - stream.keepAliveTime;
		
		if(time >= 15000) {		// If last datapoint is older than 15 sec, send keepalive
			console.log("Stream " + stream.toString() + " exceeded keepalive threshold, refreshing...");
			stream.send("\n");		// Keeps the plotly stream active by sending just a newline
		}
	}, 30000);  // Set keepalive interval as 30sec
}

KeepAlive.prototype.getTimer = function() {
	return this.timer;
};

module.exports = KeepAlive;
