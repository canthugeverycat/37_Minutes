angular.module('profile.controllers',[])

.controller('ProfileController', function($rootScope, $scope, InfoHandling, RESTFunctions, Upload) {

	$scope.$watch('files', function () {
        $scope.changeProfilePhoto($scope.files);
    });

	//Change the users profile picture
	$scope.changeProfilePhoto = function(files) {

		if (files && files.length) {
	        //Execute Upload service if there is a file in the file model
	        var file = files[0];
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
});