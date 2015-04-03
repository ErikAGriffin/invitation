(function () {
  var express = require('express');
  var app = express();
  var server = require('http').createServer(app);

  var root = __dirname + '/public/';
  var port = process.env.PORT || 3000;

  app.use(express.static(root));
  app.set('view engine', 'ejs');
  app.set('views', root );

  // --- Express Session ---
  var session = require('express-session');
  var genuuid = require('./controllers/uuid');
  app.use(session({
    genid: function(req) {return genuuid();},
    secret: 'shhh! no one can know'
  }));

  // --- Database ---
  var mongojs = require('mongojs');
  var db = mongojs( process.env.MONGOLAB_URI || 'black-tie-'+process.env.GOLDEN_NODE_ENV, ['codes','customers','admin']);
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({'extended':'true'}));

  // --- bcrypt ---
  var bcrypt = require('./controllers/bcrypt');


  // --- Server Start ---
  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });


  // --- Routes ---

  app.get('/', function(req, res) {
    var sess = req.session;
    res.sendFile(root+'default.html');
  });

  app.post('/createuser', function(req, res) {
    var params = req.body;
    var errCheck = function(err,docs) {
      if(err) {return console.error(err);}
      console.log('User created');
    };

    if (params.password === params.confirmation) {
      console.log('Password match!');
      db.codes.remove({id:params.user});
      db.customers.insert({id:params.user, password:params.password}, errCheck);
      res.send('Success!');
    }
    else {
      res.redirect('/user/'+params.user);
    }





  });


  app.get('/user/:userHash', function(req, res) {
    var sess = req.session;
    var params = req.params;
    var errCheck = function(err,docs) {
      if(err) {return console.error(err);}
      console.log('User created');
    };

    db.codes.findOne({id:params.userHash}, function(err, doc) {
      if(doc) {
        console.log('You found me!');
        res.render('login', {hash: params.userHash});
      }
      else {
        db.customers.findOne({id:params.userHash}, function(err,doc) {
          if(doc) {
            console.log('Welcome Back');
            res.send('It\'s really working');
          }
          else {
            console.log('no luck');
            res.send('404 Not Invited');
          }
        });
      }
    });
  });




  // --- Admin side ---

  app.get('/new-event', function(req, res) {
    var temp = "<article>";
    var secret = "";
    var errCheck = function(err,docs) {
      if(err) {return console.error(err);}
      console.log('Secret created');
    };

    db.codes.remove({});
    db.customers.remove({});

    for(var i=0;i<20;i++) {
      secret = genuuid();
      db.codes.insert({id:secret}, errCheck);
      temp = temp + secret +"</article><article>";
    }
    temp = temp+"</article>";

    res.send(temp);

  });

}());
