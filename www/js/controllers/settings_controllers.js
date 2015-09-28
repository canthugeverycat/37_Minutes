angular.module('settings.controllers',[])

.controller('SettingsController', function($scope, $rootScope, InfoHandling, RESTFunctions) {
	$scope.editSettings = function() {
		//Check if any of the fields are empty
		if ($rootScope.inputs.newName !== (undefined || '') || $rootScope.inputs.newTagline !== (undefined || '')) {
			//Display the loader
			$rootScope.loaders.editingProfile = true;
			
			RESTFunctions.post({
				url:'profile/settings',
				data:'Token=' + $rootScope.login.token + '&firstName=' + $rootScope.inputs.newFirstName + '&lastName=' + $rootScope.inputs.newLastName + '&tagLine=' + $rootScope.inputs.newTagline + '&mailNotifications=1',
				callback: function(response) {
					//Hide the loader
					$rootScope.loaders.editingProfile = false;
					if (!response.error) {

						//Display a success message
						InfoHandling.set('editSettingsSuccessful', 'Profile changed.', 2000, 'bg-energized');

						//Refresh the user profile
						$rootScope.getUserProfile();
						$rootScope.getActivityFeed()

						//And navigate away
						$rootScope.navigate('/profile');
					} else {
						//Display an error message
						InfoHandling.set('editSettingsFailed', response.error.errorMessage, 2000);
					}
				}
			})
		} else {
			InfoHandling.set('editSettingsFailed', "You can't leave out an empty field");
		}
	};
})