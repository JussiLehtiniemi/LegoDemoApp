
//var express = require('express');
//var router = express.Router();

/* Return the streams list from the database */
/*
router.get('/streamlist', function(req, res) {
	var db = req.db;
	var collection = db.get('streams');
	collection.find({}, {}, function(err, docs) {
		if(err) throw err;
		res.json(docs);
	});
});

module.exports = router;
*/

exports.streamlist = function(req, res) {
	var db = req.db;
	var collection = db.get('streams');
	collection.find({}, {}, function(err, docs) {
		if(err) throw err;
		res.json(docs);
	});
};