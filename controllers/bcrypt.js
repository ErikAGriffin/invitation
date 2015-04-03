(function() {
var bcrypt = require('bcrypt');

  var something = function(email, password, callback) {
    var customer = {};
    customer.email = email;
    bcrypt.hash(password, 10, function(err, hash) {
      customer.password = hash;
      callback(customer);
    });
  };


  var createCode = function(secret, callback) {
    bcrypt.hash(secret, 10, function(err, hash) {
      callback(hash);
    });
  };

  var checkUser = function(userHash, callback) {
    bcrypt.hash(userHash, 10, function(err,hash) {
      callback(hash);
    });
  };


  var somethingElse = function(entered, stored, callback) {

    bcrypt.compare(entered, stored, function(err, res) {
      callback(res);
    });
  };

  module.exports.createCode = createCode;
  module.exports.checkUser = checkUser;


}());
