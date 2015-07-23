angular.module('friends.controllers',[])

.controller('FriendsController',function($scope, $rootScope, InfoHandling, RESTFunctions, $location) {

	//Get a list of all of the user's friends
	$scope.getFriendsList = function() {

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
				if (!response.error) {
					//Store groups in the $rootScope
					$rootScope.data.groups = response.Groups;
				}
			}
		});
	};

	//Get a specific group (this functions accepts only one of the two parameters)
	$scope.getGroupItem = function(group, groupId) {

		//Move to the editGroup screen
		$location.path('/editGroup');
		
		//Check which parameter is passed and store it
		group !== null ? $rootScope.data.selectedGroup = group : selectedGroupId = groupId;

		RESTFunctions.post({
			url:'get-group-friends',
			data:'Token=' + $rootScope.login.token + '&groupId=' + (group !== null ? $rootScope.data.selectedGroup.groupId : selectedGroupId),
			callback: function(response) {
				if (response.error) {
					//Display an error message
					InfoHandling.set('getGroupItemFailed',response.error.errorMessage, 2000);
				} else {
					//Store friends as friends that are in current group
					$rootScope.data.selectedGroupFriends = response.Friends;
				}
			}
		});
	};

	//Add a new friend to the group (this function accepts only one of the last two parameters)
	$rootScope.addFriendToGroup = function(groupId, friendMail, friendId) {

		RESTFunctions.post({
			url:'add-in-group',
			data:'Token=' + $rootScope.login.token + '&groupId=' + groupId + (friendMail !== null ? '&friendsMail=' + friendmail : '') + (friendId !== null ? '&friendsUid=' + friendId : ''),
			callback: function(response) {
				if (response.error) {
					//Display an error message
					InfoHandling.set('addFriendToGroupFailed', response.error.errorMessage, 2000);
				} else {
					//Display a success message
					InfoHandling.set('addFriendToGroupSuccessful',response.Message, 2000, 'bg-energized');

					//Refresh the group to properly display friends in it
					$scope.getGroupItem(null, groupId);
				}
			}
		});
	};

	//Remove a friend from the group
	$rootScope.removeFriendFromGroup = function(groupId, friendId) {

		RESTFunctions.post({
			url:'remove-from-group',
			data:'Token=' + $rootScope.login.token + '&groupId=' + groupId + '&friendId=' + friendId,
			callback: function(response) {
				if (response.error){
					//Display an error message
					InfoHandling.set('removeFriendFromGroup',response.error.errorMessage, 2000);
				} else {
					//Display a success message
					InfoHandling.set('removeFriendFromGroupSuccessful',response.Message, 2000, 'bg-energized');

					//Refresh the group to properly display friends in it
					$scope.getGroupItem(null, groupId);
				}
			}
		});
	};

	//Create a new group
	$rootScope.createNewGroup = function() {

		RESTFunctions.post({
			url:'create-group',
			data:'Token=' + $rootScope.login.token + '&groupName=' + $rootScope.inputs.newGroupName,
			callback: function(response) {
				if (response.error) {
					//Display an error message
					InfoHandling.set('createNewGroupFailed', response.error.errorMessage, 2000);
				} else {
					//Display a success message
					InfoHandling.set('createNewGroupSuccessful', response.Message, 2000, 'bg-energized');

					//Refresh the group list to properly display the newly created group
					$scope.getGroups();

					//Go back to friends screen
					$location.path('/friends');
				}
			}
		});
	};

	//Delete a group from the list
	$rootScope.deleteGroup = function(groupId) {

		RESTFunctions.post({
			url:'delete-group',
			data:'Token=' + $rootScope.login.token + '&groupId=' + groupId,
			callback: function(response) {
				if (response.error) {
					//Display an error message
					InfoHandling.set('deleteGroupFailed', response.error.errorMessage, 2000);
				} else {
					//Display a success message
					InfoHandling.set('deleteGroupSuccessful', response.Message, 2000);

					//Refresh the group list to properly display the deleted group
					$scope.getGroups();
				}
			}
		});
	};
});