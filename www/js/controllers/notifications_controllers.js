angular.module('notifications.controllers',[])

.controller('NotificationsController', function($rootScope, $scope, InfoHandling, RESTFunctions) {

	//Grab the list of notifications
	$scope.getNotifications = function() {
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


	//Mark the notification as read (triggered on click)
	$scope.seenNotification = function(notificationId) {
		RESTFunctions.post({
			url:'mark-notification',
			data:'Token=' + $rootScope.login.token + '&notificationId=' + notificationId,
			callback: function(response) {
				if (!response.error) {
					//Update the notification list with new data
					$scope.getNotifications();
				} else {
					//Display an error message
					InfoHandling.set('seenNotificationFailed', response.error.errorMessage, 2000);
				}
			}
		});
	};
});