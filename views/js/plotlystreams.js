/*
	Configure the Plotly streams
*/

var config = require('config');
var plotly = require('plotly')(config.plotlyUsername, config.plotlyApiKey);

var selectedStream = 0;

var data = [{
	x: [], 
	y: [],
	stream: {
		token: config.plotlyTokens[selectedStream],
		maxpoints: 500
	}
	}];

var graphOptions = {
		fileopt: 'extend',
		filename: 'testgraphstream'
};

plotly.plot(data, graphOptions, function() {
	var stream = plotly.stream(config.plotlyTokens[selectedStream], function(res) {
		console.log(res);
	});
})