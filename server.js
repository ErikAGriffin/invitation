(function () {
  var express = require('express');
  var app = express();
  var server = require('http').createServer(app);

  var root = __dirname + '/public/';
  var port = process.env.PORT || 3000;

  app.use(express.static(root));

  // --- Express Session ---
  var session = require('express-session');
  var genuuid = require('./controllers/uuid');
  app.use(session({
    genid: function(req) {return genuuid();},
    secret: 'shhh! no one can know'
  }));

  // --- Database ---
  var mongojs = require('mongojs');
  var db = mongojs( process.env.MONGOLAB_URI || 'black-tie-'+process.env.GOLDEN_NODE_ENV, ['temp']);
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({'extended':'true'}));


  // --- Server Start ---
  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });


  app.get('/', function(req, res) {
    var sess = req.session;
    res.sendFile(root+'default.html');
  });

  app.get('/user/:userHash', function(req, res) {
    var sess = req.session;
    var params = req.params;

    res.sendFile(root+'login.html');

  });

}());
