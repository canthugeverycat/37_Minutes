angular.module('main.controllers',[])

.controller('MainController', function($scope, $rootScope) {
  //Defining the variables for storage
  $rootScope.inputs === undefined ? $rootScope.inputs = {} : null;
  $rootScope.data === undefined ? $rootScope.data = {} : null;
  $rootScope.login === undefined ? $rootScope.login = {} : null;

  //Store the token from localStorage in rootScope
  $rootScope.login.token = localStorage['37-mToken'];
});