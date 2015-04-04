(function() {

  var app = angular.module('inviteOnly', []);


  app.controller('NewUserController', function() {


    this.secret = "";

    this.header = "Welcome to the Party";

    this.instruction = "Choose a secret to confirm your invitation";

    this.ready = false;

    this.displayError = function() {

      console.log('Error!');

    };

    this.makeReady = function() {
      this.ready = true;
    };







  });













}());