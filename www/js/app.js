// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','directives','controllers','controllers.account','controllers.poll','canthugeverycat.services','ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  ngFB.init({appId: '717820615014962'});
  
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('cardOne', {
    url:'/cardOne',
    templateUrl:'/templates/cardOne.html'
  })

  .state('cardTwo', {
    url:'/cardTwo',
    templateUrl:'/templates/cardTwo.html'
  })

  .state('cardThree', {
    url:'/cardThree',
    templateUrl:'/templates/cardThree.html'
  })

  .state('login', {
    url:'/login',
    templateUrl:'/templates/login.html'
  })

  .state('polls', {
    url:'/polls',
    templateUrl:'/templates/polls.html'
  })

  .state('signUp', {
    url:'/signUp',
    templateUrl:'/templates/signUp.html'
  })

  .state('comments', {
    url:'/comments',
    templateUrl:'/templates/comments.html'
  })


  .state('addPoll', {
    url:'/addPoll',
    templateUrl:'/templates/addPoll.html'
  })

  .state('friends', {
    url:'/friends',
    templateUrl:'/templates/friends.html'
  })

  .state('inviteFriends', {
    url:'/inviteFriends',
    templateUrl:'/templates/inviteFriends.html'
  })
 
 .state('editGroup', {
    url:'/editGroup',
    templateUrl:'/templates/editGroup.html'
  })

 .state('newGroup', {
    url:'/newGroup',
    templateUrl:'/templates/newGroup.html'
  })

 .state('profile', {
    url:'/profile',
    templateUrl:'/templates/profile.html'
  })

  .state('pollDetails', {
    url:'/pollDetails',
    templateUrl:'/templates/pollDetails.html'
  })

  $urlRouterProvider.otherwise('/login');
})