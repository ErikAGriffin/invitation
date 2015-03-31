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
    secret: 'charlie loves chocolate'
  }));

  // --- Server Start ---
  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });


  app.get('/', function(req, res) {
    res.sendFile(root+'index.html');
  });




}());