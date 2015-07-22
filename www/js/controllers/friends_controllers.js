angular.module('friends.controllers',[])

.controller('FriendsController',function($scope, $rootScope, InfoHandling, RESTFunctions) {

	//Get a list of all of the user's friends
	$scope.getFriendsList = function() {
		RESTFunctions.post({
			url:'get-friends',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (response.error) {
					InfoHandling.set('getFriendsListFailed', response.error.errorMessage, 2000);
				} else {
					console.log(response);
				}
			}
		});
	};

	//*WIP Invite a friend
	$scope.inviteFriend = function() {
		RESTFunctions.post({
			url:'invite-friend',
			data:'Token=' + $rootScope.login.token + '&friendsMail=nini.grbic@gmail.com',
			callback: function(response) {
				console.log(response);
			}
		});
	};
});