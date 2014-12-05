
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('newindex', { title: 'Express' });
};