/*
 * GET console page
 */

exports.frame = function(req, res) {
  res.render('logframe', { title: 'Express' });
};