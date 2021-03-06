angular.module('friends.controllers',[])

.controller('FriendsController',function($scope, $rootScope, InfoHandling, RESTFunctions, $location, $ionicPopup) {

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

					//Store all friend ids in an array
					$rootScope.data.friendsInGroup = [];
					
					for (i = 0; i < $rootScope.data.selectedGroupFriends.length; i++) {
						//Iterate and push into the new array
						$rootScope.data.friendsInGroup.push($rootScope.data.selectedGroupFriends[i].friendId);
					}
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

	//Add a friend to a new group
	$scope.addFriendToNewGroup = function(friendId) {
		
		//Push the passed friendId to the friends in new group array
		$rootScope.data.friendsInNewGroup.push(friendId);
	};

	//Remove a friend from a new group
	$scope.removeFriendFromNewGroup = function(friendId) {

		//Slice the passed friendId from the friends in new group array
		$rootScope.data.friendsInNewGroup.splice($rootScope.data.friendsInNewGroup.indexOf(friendId), 1);
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

	//Change name of existing group
	$scope.changeGroupName = function(groupId) {
		RESTFunctions.post({
			url:'change-group-name',
			data:'Token=' + $rootScope.login.token + '&groupId=' + groupId + '&groupName=' + $rootScope.data.selectedGroup.groupName,
			callback:function (response) {

				if (response.error) {
					InfoHandling.set('editGroupNameFailed', response.error.errorMessage, 2000);	
				} else {
					InfoHandling.set('editGroupNameSuccessful', response.Message, 2000);
					$location.path('friends');
				}
			}

		});
	};

	//Create a new group
	$rootScope.createNewGroup = function() {

		if ($rootScope.inputs.newGroupName === ('' || undefined)){
			InfoHandling.set('createNewGroupFailed', "You can't leave the group name empty.", 2000);
		} else {

			RESTFunctions.post({
				url:'create-group',
				data:'Token=' + $rootScope.login.token + '&groupName=' + $rootScope.inputs.newGroupName + '&Users=' + $rootScope.data.friendsInNewGroup.toString(),
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

						//And clear the data
						$rootScope.data.friendsInNewGroup = [];
					}

					//Clear the group name input
					$rootScope.inputs.newGroupName = '';
				}
			});
		}
	};

	//Delete a group from the list
	$rootScope.deleteGroup = function(groupId, groupName) {
		// A confirm dialog
		var confirmPopup = $ionicPopup.confirm({
	    	title: 'Delete ' + groupName,
	    	template: 'Are you sure you want to delete ' + groupName + ' ?'
	   	});
	   	confirmPopup.then(function(res) {
	    	if(res) {
	       		RESTFunctions.post({
					url:'delete-group',
					data:'Token=' + $rootScope.login.token + '&groupId=' + groupId,
					callback: function(response) {
						if (response.error) {
							//Display an error message
							InfoHandling.set('deleteGroupFailed', response.error.errorMessage, 2000);
						} else {
							//Display a success message
							InfoHandling.set('deleteGroupSuccessful', response.Message, 2000, 'bg-energized');

							//Refresh the group list to properly display the deleted group
							$scope.getGroups();
						}
					}
				});
	     	}
	   	});
	};

	//Add friends and groups to addPoll arrays
	$scope.addFriendsToPoll = function(friend, group) {
		if (friend !== null) {
			//If selected friend is already in the array
			if ($rootScope.data.addPoll.friends.indexOf(friend) === -1) {
				//Add him to the array
				$rootScope.data.addPoll.friends.push(friend);
			} else {
				//Remove him from the array
				$rootScope.data.addPoll.friends.splice($rootScope.data.addPoll.friends.indexOf(friend),1);
			}
		} else {
			//If selected group is already in the array
			if ($rootScope.data.addPoll.groups.indexOf(group) === -1) {
				//Add him to the array
				for (x = 0; x < parseInt(group.membersCount); x++) {
					$rootScope.data.addPoll.groups.push(group);
				}
			} else {
				//Remove him from the array
				$rootScope.data.addPoll.groups.splice($rootScope.data.addPoll.groups.indexOf(group),1);
			}
		}

		//Clear the names array and push updated values into it
		$rootScope.data.addPoll.names = [];

		//Iterate through friends
		for (x in $rootScope.data.addPoll.friends) {
			//And push their ids
			$rootScope.data.addPoll.names.push($rootScope.data.addPoll.friends[x].friendName);
		}

		//Iterate through groups
		for (y in $rootScope.data.addPoll.groups) {
			//And push their ids
			$rootScope.data.addPoll.names.push($rootScope.data.addPoll.groups[y].groupName);
		}
	};

	//Remove a friend from friend list
	$scope.removeFriend = function(friendId, event, friendName) {

		//Don't redirect the user
		event.stopPropagation();

		// A confirm dialog
		var confirmPopup = $ionicPopup.confirm({
	    	title: 'Delete ' + friendName,
	    	template: 'Are you sure you want to delete ' + friendName + ' ?'
	   	});
	   	confirmPopup.then(function(res) {
	    	if(res) {
	       		RESTFunctions.post({
					url:'remove-friend',
					data:'Token=' + $rootScope.login.token + '&friendId=' + friendId,
					callback: function(response) {
						if (!response.error) {
							//Display an info message
							InfoHandling.set('removeFriendSuccessful', response.Message, 2000, 'bg-energized');

							//Update the friends list
							$rootScope.getFriendsList();
							$scope.getRecentFriends();
						} else {
							//Display an error message
							InfoHandling.set('removeFriendFailed', response.error.errorMessage, 2000);
						}
					}
				});
	     	}
	   	});
	};

	//Get friends that you have connected with recently
	$scope.getRecentFriends = function() {
		RESTFunctions.post({
			url:'recent-friends',
			data:'Token=' + $rootScope.login.token,
			callback: function(response) {
				if (!response.error) {
					$rootScope.data.recentFriends = response.friends;
				} else {
					InfoHandling.set('getRecentFriendsFailed', response.error.errorMessage, 2000);
				}
			}
		});
	};
})

.controller("AddFriendsController", function($scope, $rootScope, $cordovaContacts, RESTFunctions, InfoHandling) {
 
	//Grab the contacts from user's phonebook that have an email
    $scope.getContactList = function() {
    	$cordovaContacts.find({filter: ''}).then(function(result) {

    		//Create an empty contacts array
    		$rootScope.data.contacts = [];

    		$rootScope.tester = [];

    		//Go through every contact
    		for (i = 0; i < result.length; i++){

    			//And display only the ones with emails
    			if (result[i].emails !== null /*&& result[i].displayName !== null && result[i].displayName !== '' && result[i].displayName !== ' '*/) {

    				if (result[i].emails[0].value !== undefined || result[i].emails[0].value !== null || result[i].emails[0].value !== '' || result[i].emails[0].value !== ' ') {
    					//Push the to the contacts array
    					$rootScope.data.contacts.push(result[i]);
    				}
    			}
    		}

    		$rootScope.tester.sort(function(obj1, obj2) {
				// Ascending: first age less than the previous
				return obj1.displayName.split('')[0] - obj2.displayName.split('')[0];
			});
    		$rootScope.contactsFilled = true;
	    }, function() {});
    }
    $scope.getContactList();

    $rootScope.tempContactsArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','d','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    $rootScope.tempContactsArray2 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];

    $rootScope.inviteList = [];
    $scope.addFriendToInvite = function(email) {
    	if ($rootScope.inviteList.indexOf(email) === -1) {
    		$rootScope.inviteList.push(email);
    	} else {
    		$rootScope.inviteList.splice($rootScope.inviteList.indexOf(email),1);
    	}
    };

    $rootScope.inviteListFriends = function() {
    	for (x in $rootScope.inviteList) {
    		$scope.inviteFriends($rootScope.inviteList[x]);
    	}

    	$rootScope.inviteList = [];
    };

    //Invite a friend via contacts
    $scope.inviteFriends = function(email) {
    	RESTFunctions.post({
			url:'invite-friend',
			data:'Token=' + $rootScope.login.token + '&friendsMail=' + email,
			callback: function(response) {
				if (!response.error) {
					InfoHandling.set('inviteFriendSuccessful', response.Message, 2000, 'bg-energized');
				} else {
					InfoHandling.set('inviteFriendFailed', response.error.errorMessage, 2000);
				}
			} 
		});
    };
});