angular.module('main.controllers',[])

.controller('MainController', function($scope, $rootScope, $location, $timeout, RESTFunctions, InfoHandling, $ionicScrollDelegate) {
  //Defining the variables for storage
  $rootScope.inputs === undefined ? $rootScope.inputs = {} : null;
  $rootScope.data === undefined ? $rootScope.data = {} : null;
  $rootScope.login === undefined ? $rootScope.login = {} : null;

  //Store the token from localStorage in rootScope
  $rootScope.login.token = localStorage['37-mToken'];
  $rootScope.login.firstTime = localStorage['37-mFirstTime'];

  //Storing the navigation tab urls
  $scope.navigationUrls = ['/polls','/notifications','/friends','/profile','/settings'];

  //Navigate to the left
  $scope.navigateLeft = function() {
  	//Store the current screen
  	navigationIndex = $scope.navigationUrls.indexOf($location.path());
  	//If the current screen is first
  	if (navigationIndex === 0) {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoLeft')).attr('href','#' + $scope.navigationUrls[$scope.navigationUrls.length - 1]);
  		$timeout(function() {
  			angular.element(document.querySelector('.navGoLeft')).triggerHandler('click');
		}, 0);
  	} else {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoLeft')).attr('href','#' + $scope.navigationUrls[navigationIndex - 1]);
  		$timeout(function() {
  			angular.element(document.querySelector('.navGoLeft')).triggerHandler('click');
		}, 0);
  	}
  };

  //Navigate to the right
  $scope.navigateRight = function() {
  	//Store the current screen
  	navigationIndex = $scope.navigationUrls.indexOf($location.path());
  	//If the current screen is last
  	if (navigationIndex === $scope.navigationUrls.length - 1) {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoRight')).attr('href','#' + $scope.navigationUrls[0]);
  		$timeout(function() {
  			angular.element(document.querySelector('.navGoRight')).triggerHandler('click');
		}, 0);
  	} else {
  		//Set the href attribute of the invisible <a> tag to the next tab location
  		angular.element(document.querySelector('.navGoRight')).attr('href','#' + $scope.navigationUrls[navigationIndex + 1]);
  		$timeout(function() {
  			angular.element(document.querySelector('.navGoRight')).triggerHandler('click');
		}, 0);
  	}
  };

  //Go to the specific page
  $rootScope.navigateGoTo = function(direction) {
  	$location.path('/' + angular.element(document.querySelector(direction)).attr('href').split('/')[1]);
  };

  //Get comments for the current poll
  $rootScope.getComments = function(pollId, scrollBottom) {
    RESTFunctions.post({
      url:'get-comments',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId,
      callback: function(response) {
        if (response.error) {
          InfoHandling.set('getCommentsFailed',response.error.errorMessage, 2000);
        } else {
          $rootScope.data.pollComments = [];
          $rootScope.data.pollComments = response.comments;
          $location.path('/comments');
          console.log('\nComments array for' + pollId + ':');
          console.log(response.comments);
          scrollBottom === true ? $ionicScrollDelegate.scrollBottom(true) : null;
        }
      }
    });
  };
});