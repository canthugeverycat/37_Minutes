angular.module('friends.controllers',[])

.controller('FriendsController',function($scope, $rootScope, InfoHandling, RESTFunctions, $location) {

	//Get a list of all of the user's friends
	$scope.getFriendsList = function() {
		RESTFunctions.post({
			url:'get-friends',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (response.error) {
				} else {
					$rootScope.data.friendsList = response.Friends;
					console.log(response.Friends);
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

	//Get the user's groups
	$scope.getGroups = function() {
		RESTFunctions.post({
			url:'get-groups',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (response.error) {
				} else {
					$rootScope.data.groups = response.Groups;
					console.log(response.Groups);
				}
			}
		});
	};

	//Get a specific group
	$scope.getGroupItem = function(group, groupId) {
		group !== null ? $rootScope.data.selectedGroup = group : selectedGroupId = groupId;
		console.log('Entered group:');
		console.log($rootScope.data.selectedGroup.groupId);
		RESTFunctions.post({
			url:'get-group-friends',
			data:'Token=' + $rootScope.login.token + '&groupId=' + (group !== null ? $rootScope.data.selectedGroup.groupId : selectedGroupId),
			callback: function(response) {
				console.log('groupid ' + $rootScope.data.selectedGroup.groupId);
				if (response.error) {
					InfoHandling.set('getGroupItemFailed',response.error.errorMessage, 2000);
				} else {
					$rootScope.data.selectedGroupFriends = response.Friends;
				}
			}
		});
		$location.path('/editGroup');
	};

	//Add a friend to a group
	$rootScope.addFriendToGroup = function(groupId, friendMail, friendId) {
		RESTFunctions.post({
			url:'add-in-group',
			data:'Token=' + $rootScope.login.token + '&groupId=' + groupId + (friendMail !== null ? '&friendsMail=' + friendmail : '') + (friendId !== null ? '&friendsUid=' + friendId : ''),
			callback: function(response) {
				if (response.error) {
					InfoHandling.set('addFriendToGroupFailed', response.error.errorMessage, 2000);
				} else {
					console.log('addFriendToGroup:');
					console.log(response);
					InfoHandling.set('addFriendToGroupSuccessful',response.Message, 2000, 'bg-energized');
					$scope.getGroupItem(null, groupId);
				}
			}
		});
	};

	//Remove friend from a group
	$rootScope.removeFriendFromGroup = function(groupId, friendId) {
		RESTFunctions.post({
			url:'remove-from-group',
			data:'Token=' + $rootScope.login.token + '&groupId=' + groupId + '&friendId=' + friendId,
			callback: function(response) {
				if (response.error){
					InfoHandling.set('removeFriendFromGroup',response.error.errorMessage, 2000);
				} else {
					console.log('getGroupItem(' + groupId + ')');
					InfoHandling.set('removeFriendFromGroupSuccessful',response.Message, 2000, 'bg-energized');
					$scope.getGroupItem(null, groupId);
				}
			}
		});
	};
});