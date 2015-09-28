// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core','ionic.service.push','ngCordova','directives','main.controllers','reset.controllers','account.controllers','notifications.controllers','poll.controllers','comments.controllers','friends.controllers','profile.controllers','social.controllers','settings.controllers','ngOpenFB','canthugeverycat.services','ngAnimate','ngFileUpload'])

.run(function($ionicPlatform, $cordovaPush) {
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
})

.run(function ($ionicPlatform, ngFB) {
  ngFB.init({appId: '717820615014962'});
})

.config(['$ionicAppProvider','$ionicConfigProvider','$httpProvider','$compileProvider', function($ionicAppProvider,$ionicConfigProvider,$httpProvider,$compileProvider) {

  // Identify app
  $ionicAppProvider.identify({
  
    // Your App ID
    app_id: '5796c606',
    
    // The public ionic API key services will use for this app
    
    // api_key: 'eg3843764837e46g476f8638687e62837e6',    // Testing
    api_key: 'AIzaSyCM_E34cgzFtCiIjTpSvoTiL7ZyYuZOHP4',     // Production!
    
    // Your GCM sender ID/project number (Uncomment if supporting Android)
    gcm_id: '614155252203' // Google public API key: e3f5673e6578e8567256875867e25876e24
    
    // Set the app to use development pushes (that bypass Apple/Google)
    // , dev_push: true
  });
  
}])

.run(function($ionicPlatform, $rootScope, $ionicPush, $ionicUser, $ionicModal, $ionicHistory, $ionicPopup, $ionicViewSwitcher, $cordovaPush, $state, $http, $cordovaStatusbar) {
  
  $ionicPlatform.ready(function() {

      var user = $ionicUser.get();

      if(!user.user_id) {
        // Set your user_id here, or generate a random one
        user.user_id = $ionicUser.generateGUID();
      };
          
      $ionicUser.identify(user);
  }); // End $ionicPlatform.ready()
})

.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $stateProvider

  .state('cardOne', {
    url:'/cardOne',
    templateUrl:'templates/cardOne.html'
  })

  .state('cardTwo', {
    url:'/cardTwo',
    templateUrl:'templates/cardTwo.html'
  })

  .state('cardThree', {
    url:'/cardThree',
    templateUrl:'templates/cardThree.html'
  })

  .state('login', {
    url:'/login',
    templateUrl:'templates/login.html'
  })

  .state('polls', {
    url:'/polls',
    templateUrl:'templates/polls.html'
  })

  .state('signUp', {
    url:'/signUp',
    templateUrl:'templates/signUp.html'
  })

  .state('comments', {
    url:'/comments',
    templateUrl:'templates/comments.html'
  })


  .state('addPoll', {
    url:'/addPoll',
    templateUrl:'templates/addPoll.html'
  })

  .state('friends', {
    url:'/friends',
    templateUrl:'templates/friends.html'
  })

  .state('addFriends', {
    url:'/addFriends',
    templateUrl:'templates/addFriends.html'
  })

  .state('inviteFriends', {
    url:'/inviteFriends',
    templateUrl:'templates/inviteFriends.html'
  })
 
 .state('editGroup', {
    url:'/editGroup',
    templateUrl:'templates/editGroup.html'
  })

 .state('newGroup', {
    url:'/newGroup',
    templateUrl:'templates/newGroup.html'
  })

 .state('profile', {
    url:'/profile',
    templateUrl:'templates/profile.html'
  })

  .state('pollDetails', {
    url:'/pollDetails',
    templateUrl:'templates/pollDetails.html'
  })

  .state('settings', {
    url:'/settings',
    templateUrl:'templates/settings.html'
  })

  .state('notifications', {
    url:'/notifications',
    templateUrl:'templates/notifications.html'
  })

  .state('reset', {
    url:'/reset',
    templateUrl:'templates/reset.html'
  })

  $urlRouterProvider.otherwise('login');
}])


//Converts an angular string to int
.filter('int', function() {
    return function(input) {
      return parseInt(input, 10);
    }
})

.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
})