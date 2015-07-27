angular.module('notifications.controllers',[])

.controller('NotificationsController', function($rootScope, $scope, InfoHandling, RESTFunctions) {

	$scope.getNotifications = function() {
		RESTFunctions.post({
			url:'notifications',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (!response.error) {
					$rootScope.data.notifications = response.notifications;
					console.log($rootScope.data.notifications);
				} else {
					InfoHandling.set('getNotificationsFailed', response.error.errorMessage, 2000);
				}
			}
		});
	};

	$scope.seenNotification = function(notificationId) {
		RESTFunctions.post({
			url:'mark-notification',
			data:'Token=' + $rootScope.login.token + '&notificationId=' + notificationId,
			callback: function(response) {
				if (!response.error) {
					$scope.getNotifications();
				} else {
					InfoHandling.set('seenNotificationFailed', response.error.errorMessage, 2000);
				}
			}
		});
	};

});