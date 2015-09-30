angular.module('profile.controllers',[])

.controller('ProfileController', function($rootScope, $scope, InfoHandling, RESTFunctions, Upload) {

	$scope.$watch('filesProfile', function () {
        $scope.changeProfilePhoto($scope.filesProfile);
    });

	//Change the users profile picture
	$scope.changeProfilePhoto = function(filesProfile) {

		if (filesProfile && filesProfile.length) {
	        //Execute Upload service if there is a file in the file model
	        var file = filesProfile[0];
	        Upload.upload({
	            url: 'http://p.vz301.verteez.net/mobile-api/v1/profile/new-image',
	            fields: {'Token': $rootScope.login.token},
	            file:file,
	            fileFormDataName:'photo'
	        }).progress(function(evt) {
	        }).success(function (response) {
	          if (response.error) {
	            //Display an error message
	            InfoHandling.set('changeProfilePictureFailed',response.error.errorMessage,2000);

	            //Clear the data
	            $rootScope.profileImageUploadPercent = 0;
	          } else {

	          	//Display a success message
	          	InfoHandling.set('changeProfilePictureSuccessful', response.Message, 2000, 'bg-energized');

	          	//Update the user's profile
	          	$rootScope.getUserProfile();
	          	$rootScope.getActivityFeed();
	          	$rootScope.profileImageUploadPercent = 0;
	          }
	        });
	    }
	};

	//Invite a friend via id
    $rootScope.addFriendFromProfile = function(friendId) {
    	RESTFunctions.post({
			url:'invite-friend',
			data:'Token=' + $rootScope.login.token + '&friendsId=' + friendId,
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