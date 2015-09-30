angular.module('main.controllers',[])

.controller('MainController', function($scope, $rootScope, $location, $timeout, RESTFunctions, InfoHandling, $ionicScrollDelegate, $ionicHistory, $ionicPopup) {
  ionic.Platform.ready(function() {
    // hide the status bar using the StatusBar plugin and lock the orientation with screen orientation plugin
    screen.lockOrientation('portrait');
  });  
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
  $rootScope.addPollFileExists = false;
  $rootScope.uploadingPollImage = false;
  $rootScope.contactsFilled = false;

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

    if (url === '/login') {
      // A confirm dialog
      var confirmPopup = $ionicPopup.confirm({
          title: 'Logout',
          template: 'Are you sure you want logout'
        });

        confirmPopup.then(function(res) {
          if(res) {$location.path(url);}
        });
    } else {
      $location.path(url);
    }
  };

  //Go back one screen
  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  };

  //Send a login request
  $rootScope.loginRequest = function(userId, firstName, lastName, token) {
    RESTFunctions.post({
      url:'fblogin',
      data:'firstName=' + firstName + '&lastName=' + lastName + '&fbUserId=' + userId + '&fbAccessToken=' + token,
      callback: function(response){
        if (!response.error) {
          //Store the token in localStorage and $rootScope
          localStorage['37-mToken'] = response.Token;
          $rootScope.login.token = response.Token;
          //Redirect user to main screen
          $location.path('/polls');
        } else {
          //Display an error
          InfoHandling.set('loginRequestFailed', response.error.errorMessage, 2000);
        }
      }
    })
  };

  //Invite friends via email only
  $rootScope.inviteByMail = function() {
    if ($rootScope.inputs.inviteMail !== undefined || $rootScope.inputs.inviteMail !== ''){
      RESTFunctions.post({
        url:'invite-friend',
        'data':'Token=' + $rootScope.login.token + '&friendsMail=' + $rootScope.inputs.inviteMail,
        callback : function(response) {
          $rootScope.inputs.inviteMail = '';
          if (!response.error) {
          InfoHandling.set('inviteFriendSuccessful', response.Message, 2000, 'bg-energized');
        } else {
          InfoHandling.set('inviteFriendFailed', response.error.errorMessage, 2000);
        }
        }
      })
    } else {
      InfoHandling.set('inviteFriendFailed', 'Cant leave the e-mail field empty', 2000);
    }
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
    // A confirm dialog
    var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure you want to log out'
      });

      confirmPopup.then(function(res) {
        if(res) {
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
                $rootScope.data = {};

                //Navigate to login screen
                $location.path('/login');
              }
            }
          });
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

  //Get a list of all of the user's friends
  $rootScope.getFriendsList = function() {

    RESTFunctions.post({
      url:'get-friends',
      data:'Token=' + $rootScope.login.token,
      callback: function(response) {
        if (!response.error) {
          //Store friends in the $rootScope
          $rootScope.data.friendsList = response.Friends;
        }
      }
    });
  };

  //Grab the list of notifications
  $rootScope.getNotifications = function() {
    $rootScope.loaders.notifications = true;

    //Clear the data
    $rootScope.data.notifications = [];
    $rootScope.data.newNotifications = 0;
    
    RESTFunctions.post({
      url:'notifications',
      data:'Token=' + $rootScope.login.token,
      callback: function(response) {
        //Stop the ion-refresher (pull-to-refresh) from spinning
        $scope.$broadcast('scroll.refreshComplete');

        $rootScope.loaders.notifications = false;
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

    profileId !== undefined ? $rootScope.user = false : $rootScope.user = true;

    //Redirect the user
    profileId !== undefined ? $rootScope.navigate('/profile') : null;

    RESTFunctions.post({
      url:'profile',
      data:'Token=' + $rootScope.login.token + '&userId=' + profileId,
      callback: function(response) {
        console.log(response.profile);
        if (!response.error) {
          //Store the data
          $rootScope.data.userProfile = response.profile;

          $rootScope.inputs.newFirstName = response.profile.firstName;
          $rootScope.inputs.newLastName = response.profile.lastName;
          $rootScope.inputs.newTagline = response.profile.tagLine;
          $rootScope.data.userProfile.profileImage === '' ? $rootScope.data.userProfile.profileImage = '../img/default_avatar.png' : null;

          if (profileId === undefined) {
            $rootScope.userId = response.profile.profileId;
          }
        } else {
          //Display an error
          InfoHandling.set('getUserProfileFailed', response.error.errorMessage, 2000);
        }
      }
    });
  };
  $rootScope.getUserProfile();

  //Get the user's activity feed
  $rootScope.getActivityFeed = function(userId) {
    $rootScope.data.activityFeed = undefined;
    RESTFunctions.post({
      url:'activity-feed',
      data:'Token=' + $rootScope.login.token + '&userId=' + (userId !== undefined ? userId : ''),
      callback: function(response) {
        console.log(response.activity);
        if (!response.error) {
          //Store the data
          $rootScope.data.activityFeed = response.activity;

          //Loop and check if the user is a friend
          var tempFriendsArray = [];
          for (x in $rootScope.data.friendsList){
            tempFriendsArray.push($rootScope.data.friendsList[x].friendId);

            if (parseInt(x) === (parseInt($rootScope.data.friendsList.length - 1))){
              if (tempFriendsArray.indexOf(parseInt(userId)) !== -1){
                $rootScope.isFriend = true;
              } else {
                $rootScope.isFriend = false;
              }
            }
          }

          if (parseInt(userId) === parseInt($rootScope.userId)){
            $rootScope.user = true;
          }

          console.log('isFriend: ' + $rootScope.isFriend);
          console.log('user: ' + $rootScope.user);
        } else {
          //Display an error
          InfoHandling.set('getActivityFeed', response.error.errorMessage, 2000);
        }
      }
    });
  };
  $rootScope.getActivityFeed();

  var tempPollId;
  $rootScope.clickCount = false;
  //Vote on a specific poll
  $rootScope.voteOnPoll = function(pollId, vote) {
    if ($rootScope.clickCount === true && tempPollId === pollId){
      tempPollId = pollId;
      RESTFunctions.post({
        url:'vote',
        data:'Token=' + $rootScope.login.token + '&questionId=' + pollId + '&Vote=' + vote,
        callback: function(response) {
          $rootScope.clickCount = false;
          if (response.error) {
            //Display an error message
            InfoHandling.set('voteOnPollfailed',response.error.errorMessage,2000,'bg-energized');
          } else {
            //Properly transition the voting options bars
            $rootScope.pollTransitionBars(pollId);

            $rootScope.getPollItem(pollId);
          }
        }
      });
    } else {
      tempPollId = pollId;
      $rootScope.clickCount = true;
    }
  };
})

.controller('PushController', function($scope, $rootScope, $cordovaPush, $ionicPush, $ionicUser, RESTFunctions, $location) {
  
  if (ionic.Platform.isIOS() === true || ionic.Platform.isAndroid() === true) {
    //Basic registration
    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
      $rootScope.token = data.token;
      //Send the token to the API
      RESTFunctions.post({
        url:'push/register-token',
        data:'Token=' + $rootScope.login.token + '&pushToken=' + $rootScope.token + '&platform=' + (ionic.Platform.isAndroid() === true ? '1' : '0'),
        callback: function(response) {
        }
      });
    });

    $rootScope.pushRegister = function() {

      $ionicPush.register({
        canShowAlert: false,
        onNotification: function(notification) {
          // Called for each notification for custom handling
          $scope.lastNotification = JSON.stringify(notification);
        }
      }).then(function(deviceToken) {
        //Store the token in model
        $rootScope.token = deviceToken;
      });
    }
  }

  //Handle new notifications
  $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    if (ionic.Platform.isAndroid() === true) {
      if (notification.android.payload.notificationType === 'question' || 'vote') {
        $rootScope.payload = '/pollDetails';
        alert($rootScope.payload);
        //$rootScope.getPollItem(notification.android.payload.questionId);
      } else if (notification.android.payload.notificationType === 'comment') {
        //$rootScope.getComments(notification.android.payload.questionId);$rootScope.getPollItem(notification.android.payload.questionId, false);$rootScope.data.commentsTitle = $rootScope.data.poll.question.toUpperCase();
        $rootScope.payload = '/comments';
        alert($rootScope.payload);
      } else {
        $rootScope.getNotifications();
        $rootScope.payload = '/notifications';
        alert($rootScope.payload);
      }
    }
  });
})