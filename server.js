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

  // --- No Scan ---

  app.get('/', function(req, res) {
    var sess = req.session;
    res.sendFile(root+'default.html');
  });

  // --- Create User ---

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


  // --- Login Page ---

  app.get('/user/:userHash', function(req, res) {
    var sess = req.session;
    var params = req.params;
    var errCheck = function(err,docs) {
      if(err) {return console.error(err);}
      console.log('User created');
    };

    if(sess.admin) {
      console.log('admin!');
      db.customers.findOne({id:params.userHash}, function(err,doc) {
        if(doc) {
          db.customers.remove({id:params.userHash});
          res.render('ticketcheck', {valid:true});}
        else {res.render('ticketcheck', {valid:false});}
      });
      return;
    }

    db.codes.findOne({id:params.userHash}, function(err, doc) {
      if(doc) {
        console.log('New User!');
        res.render('login', {hash: params.userHash, registered: false});
      }
      else {
        db.customers.findOne({id:params.userHash}, function(err,doc) {
          if(doc) {
            console.log('Welcome Back');
            res.render('login', {hash: params.userHash, registered: true});
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

  app.get('/adminpage', function(req, res) {
    var sess = req.session;
    sess.admin = "abc123";
    res.send('Logged in');

  });

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
