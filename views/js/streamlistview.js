// Stream list will be displayed on the page
var streamList = [];

// DOM Ready

$(document).ready(function() {
	// Populate streams list when page loads
	populateTable();
});

// Functions

// Fill table data
function populateTable() {

	var tableContent = '';

	// jQuery AJAX for JSON
	$.getJSON('/streams/streamlist', function(data) {

		console.log('Populating table...')

		// Populate the table
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><h4 class="ui center aligned header">' + this.name + '</h4></td>';
			tableContent += '<td>' + this.streamToken + '</td>';
			tableContent += '<td>' + this.layout.xaxis.title + '</td>';
			tableContent += '<td>' + this.layout.yaxis.title + '</td>';
			tableContent += '<td>' + this.maxPoints + '</td>';
			tableContent += '</tr>';
		});

		// Inject table to html page
		$('streamList table tbody').html(tableContent);
	});
};