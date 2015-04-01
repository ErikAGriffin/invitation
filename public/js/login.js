(function() {
  var app = angular.module('loginPage', []);

  app.controller('TabController', function() {

    this.isNewUser = true;

    this.selectTab = function(tabNum) {
      this.isNewUser = tabNum === 1;
    };

  });


}());