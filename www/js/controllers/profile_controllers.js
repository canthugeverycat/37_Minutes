angular.module('profile.controllers',[])

.controller('ProfileController', function($rootScope, $scope, InfoHandling, RESTFunctions) {

	$scope.getActivityFeed = function() {
		RESTFunctions.post({
			url:'activity-feed',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (!response.error) {
					$rootScope.data.activityFeed = response.activity;
				} else {
					InfoHandling.set('getActivityFeed', response.error.errorMessage, 2000);
				}
			}
		});
	};

});