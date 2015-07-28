angular.module('profile.controllers',[])

.controller('ProfileController', function($rootScope, $scope, InfoHandling, RESTFunctions) {

	//Get the user's profile info
	$scope.getUserProfile = function() {
		RESTFunctions.post({
			url:'profile',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (!response.error) {
					//Store the data
					$rootScope.data.userProfile = response.profile;
				} else {
					//Display an error
					InfoHandling.set('getUserProfileFailed', response.error.errorMessage, 2000);
				}
			}
		});
	};

	//Get the user's activity feed
	$scope.getActivityFeed = function() {
		RESTFunctions.post({
			url:'activity-feed',
			data:'Token=' + $rootScope.login.token,
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

});