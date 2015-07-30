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

  //Store the user token and a firstTime bool from localStorage in $rootScope
  $rootScope.login.token = localStorage['37-mToken'];
  $rootScope.login.firstTime = localStorage['37-mFirstTime'];

  //Storing the navigation tab urls (for navigating through them)
  $scope.navigationUrls = ['/polls','/notifications','/friends','/profile','/settings'];

  //Navigate to the left (triggers on swipe)
  $scope.navigateLeft = function() {

  	//Store the current screen
  	navigationIndex = $scope.navigationUrls.indexOf($location.path());

  	//If the current screen is first
  	if (navigationIndex === 0) {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoLeft')).attr('href','#' + $scope.navigationUrls[$scope.navigationUrls.length - 1]);
  		$timeout(function() {angular.element(document.querySelector('.navGoLeft')).triggerHandler('click')}, 0);
  	} else {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoLeft')).attr('href','#' + $scope.navigationUrls[navigationIndex - 1]);
  		$timeout(function() {angular.element(document.querySelector('.navGoLeft')).triggerHandler('click')}, 0);
  	}
  };

  //Navigate to the right (triggers on swipe)
  $scope.navigateRight = function() {

  	//Store the current screen
  	navigationIndex = $scope.navigationUrls.indexOf($location.path());

  	//If the current screen is last
  	if (navigationIndex === $scope.navigationUrls.length - 1) {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoRight')).attr('href','#' + $scope.navigationUrls[0]);
  		$timeout(function() {angular.element(document.querySelector('.navGoRight')).triggerHandler('click')}, 0);
  	} else {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoRight')).attr('href','#' + $scope.navigationUrls[navigationIndex + 1]);
  		$timeout(function() {angular.element(document.querySelector('.navGoRight')).triggerHandler('click')}, 0);
  	}
  };

  //Go to the specific page (triggers on swipe function)
  $rootScope.navigateGoTo = function(direction) {

    //Grab the url from href attribute of an <a> tag
  	$location.path('/' + angular.element(document.querySelector(direction)).attr('href').split('/')[1]);
  };


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

    //If we are supposed to navigate to pollDetails screen
    redirect === true ? null : $location.path('/pollDetails');

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
    console.log('Accepting ' + notificationId + 'with ' + acceptInvite + ' for ' + friendId);
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
});