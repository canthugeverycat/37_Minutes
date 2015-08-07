angular.module('main.controllers',[])

.controller('MainController', function($scope, $rootScope, $location, $timeout, RESTFunctions, InfoHandling, $ionicScrollDelegate, $ionicHistory) {
  //We create the non-existing parent keys so we can store children in later (otherwise we'll get a reference error)
  $rootScope.inputs === undefined ? $rootScope.inputs = {} : null;
  $rootScope.data === undefined ? $rootScope.data = {} : null;
  $rootScope.login === undefined ? $rootScope.login = {} : null;
  $rootScope.data.addPoll === undefined ? $rootScope.data.addPoll = {} : null;
  $rootScope.data.addPoll.names === undefined ? $rootScope.data.addPoll.names = [] : null;
  $rootScope.data.addPoll.friends === undefined ? $rootScope.data.addPoll.friends = [] : null;
  $rootScope.data.addPoll.friendIds === undefined ? $rootScope.data.addPoll.friendIds = [] : null;
  $rootScope.data.addPoll.groups === undefined ? $rootScope.data.addPoll.groups = [] : null;
  $rootScope.data.addPoll.groupIds === undefined ? $rootScope.data.addPoll.groupIds = [] : null;
  $rootScope.imageUploadPercent = 0;
  $rootScope.loaders === undefined ? $rootScope.loaders = {} : null;
  $rootScope.navigateIndex = 0;
  $rootScope.data.friendsInNewGroup = [];
  $scope.showEmojis = false;
  $rootScope.inputs.newComment = '';

  //Defining emoji types

  $rootScope.data.emojis = [{
    code:'ion-ios-heart',
    trigger:'<3'
  },
  {
    code:'ion-ios-star',
    trigger:':star:'
  },
  {
    code:'ion-ios-cloud',
    trigger:':cloud:'
  },
  {
    code:'ion-beer',
    trigger:':beer:'
  },
  {
    code:'ion-coffee',
    trigger:':coffee:'
  },
  {
    code:'ion-pizza',
    trigger:':pizza:'
  },
  {
    code:'ion-bug',
    trigger:':bug:'
  },
  {
    code:'ion-headphone',
    trigger:':music:'
  },
  {
    code:'ion-happy-outline',
    trigger:':smile:'
  },
  {
    code:'ion-sad-outline',
    trigger:':sad:'
  },
  {
    code:'ion-bowtie',
    trigger:':bowtie:'
  },
  {
    code:'ion-planet',
    trigger:':planet:'
  },
  {
    code:'ion-ios-alarm-outline',
    trigger:':alarm:'
  },
  {
    code:'ion-ios-nutrition',
    trigger:':carrot:'
  },
  {
    code:'ion-ios-paw',
    trigger:':paw:'
  },
  {
    code:'ion-ios-snowy',
    trigger:':snowflake:'
  },
  {
    code:'ion-ios-moon',
    trigger:':moon:'
  },
  {
    code:'ion-ios-sunny-outline',
    trigger:':sun:'
  },
  {
    code:'ion-social-snapchat-outline',
    trigger:':ghost:'
  },
  {
    code:'ion-social-usd',
    trigger:'$'
  }
  ];

  //Store the user token and a firstTime bool from localStorage in $rootScope
  $rootScope.login.token = localStorage['37-mToken'];
  $rootScope.login.firstTime = localStorage['37-mFirstTime'];

  //Navigate to the passed screen
  $rootScope.navigate = function(url) {
    $location.path(url);
  };

  //Go back one screen
  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  };


  //Get comments for the current poll
  $rootScope.getComments = function(pollId) {

    //Navigate to comments screen
    $location.path('/comments');

    $rootScope.getPollItem(pollId);
    RESTFunctions.post({
      url:'get-comments',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('getCommentsFailed',response.error.errorMessage, 2000);
        } else {
          //Clear the old comments and display new ones
          $rootScope.data.pollComments = [];
          $rootScope.data.pollComments = response.comments;
        }
      }
    });
  };


  //Logs the user out and clears the data
  $rootScope.logout = function() {
    RESTFunctions.post({
      url:'logout',
      data:'Token=' + $rootScope.login.token,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('logoutFailed', response.error.errorMessage, 2000);
        } else {

          //Clear the login data
          localStorage.removeItem('37-mToken');
          $rootScope.login.token = '';

          //Navigate to login screen
          $location.path('/login');
        }
      }
    });
  };

  //Grab a single poll item
  $rootScope.getPollItem = function(questionId, redirect) {

    redirect !== undefined ? $rootScope.navigate('/pollDetails') : null;

    RESTFunctions.post({
      url:'get-question',
      data:'Token=' + $rootScope.login.token + '&questionId=' + questionId,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('getPollItemFailed',response.error.errorMessage,2000);
        } else {
          //Store the poll details
          $rootScope.data.poll = response.question;
        }
      }
    });
  };

  //Grab the list of notifications
  $rootScope.getNotifications = function() {

    //Clear the data
    $rootScope.data.notifications = [];
    $rootScope.data.newNotifications = 0;
    
    RESTFunctions.post({
      url:'notifications',
      data:'Token=' + $rootScope.login.token,
      callback: function(response) {
        if (!response.error) {
          //Store the data
          $rootScope.data.notifications = response.notifications;

          $rootScope.data.newNotifications = 0;
          //Iterate over received data and check for new notifications
          for (i = 0; i < response.notifications.length; i++) {
            //Increase the integer up
            response.notifications[i].read === 0 ? $rootScope.data.newNotifications ++ : null;
          }
        } else {
          //Display an error message
          InfoHandling.set('getNotificationsFailed', response.error.errorMessage, 2000);
        }
      }
    });
  };

  //Accept a friend request
  $rootScope.acceptFriendRequest = function(friendId, acceptInvite, notificationId) {
    RESTFunctions.post({
      url:'accept-request',
      data:'Token=' + $rootScope.login.token + '&friendId=' + friendId,
      callback: function(response) {
        if (!response.error) {
          //Display an error message
          InfoHandling.set('acceptFriendRequestSuccessful',response.Message, 2000, 'bg-energized');
        } else {
          //Display an info message
          InfoHandling.set('acceptFriendRequestFailed', response.error.errorMessage, 2000);
        }
      }
    });
  };

  //Get the user's profile info
  $rootScope.getUserProfile = function(profileId) {
    //Redirect the user
    profileId !== undefined ? $rootScope.navigate('/profile') : null;

    RESTFunctions.post({
      url:'profile',
      data:'Token=' + $rootScope.login.token + '&userId=' + profileId,
      callback: function(response) {
        if (!response.error) {
          //Store the data
          $rootScope.data.userProfile = response.profile;
          $rootScope.inputs.newName = response.profile.firstName + ' ' + response.profile.lastName;
          $rootScope.inputs.newTagline = response.profile.tagLine;
        } else {
          //Display an error
          InfoHandling.set('getUserProfileFailed', response.error.errorMessage, 2000);
        }
      }
    });
  };

  //Get the user's activity feed
  $rootScope.getActivityFeed = function(userId) {
    RESTFunctions.post({
      url:'activity-feed',
      data:'Token=' + $rootScope.login.token + '&userId=' + userId,
      callback: function(response) {
        if (!response.error) {
          //Store the data
          $rootScope.data.activityFeed = response.activity;
        } else {
          //Display an error
          InfoHandling.set('getActivityFeed', response.error.errorMessage, 2000);
        }
      }
    });
  };

  //Vote on a specific poll
  $rootScope.voteOnPoll = function(pollId, vote) {

    RESTFunctions.post({
      url:'vote',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId + '&Vote=' + vote,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('voteOnPollfailed',response.error.errorMessage,2000,'bg-energized');
        } else {
          //Properly transition the voting options bars
          $rootScope.pollTransitionBars(pollId);
        }
      }
    });
  };
});