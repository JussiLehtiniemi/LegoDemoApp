
var socket = io();

socket.on('connection', function(msg) {
	console.log('Connected!');
});

socket.on('console message', function(msg) {

	//console.log('Received message: ' + msg);

	if(msg.match(/WARN/)) {
		$('#console').append($('<li style="color:FF9900">').text(msg));
	}
	else if(msg.match(/ERROR/)) {
		$('#console').append($('<li style="color:#FF0000">').text(msg));
	}
	else {
		$('#console').append($('<li>').text(msg));
	}
});