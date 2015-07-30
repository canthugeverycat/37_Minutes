angular.module('notifications.controllers',[])

.controller('NotificationsController', function($rootScope, $scope, InfoHandling, RESTFunctions) {

	//Mark the notification as read (triggered on click)
	$scope.seenNotification = function(notificationId, acceptInvite, friendId) {
		$rootScope.tempInviteAccept = acceptInvite;
		$rootScope.tempInviteFriendId = friendId;
		RESTFunctions.post({
			url:'mark-notification',
			data:'Token=' + $rootScope.login.token + '&notificationId=' + notificationId,
			callback: function(response) {
				if (!response.error) {
					//Update the notification list with new data
					$rootScope.getNotifications();
				} else {
					//Display an error message
					InfoHandling.set('seenNotificationFailed', response.error.errorMessage, 2000);
				}
			}
		});
	};
});