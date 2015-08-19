angular.module('reset.controllers',[])

.controller('ResetController',function($rootScope, $scope, $location, RESTFunctions, InfoHandling) {
	$scope.resetPassword = function() {
		RESTFunctions.post({
			url:'reset-pass/send-code',
			data:'mail=' + $rootScope.inputs.resetMail,
			callback: function(response) {
				if (!response.error) {
					$rootScope.codeSent = true;
					InfoHandling.set('resetPasswordSuccessful',response.message,2000,'bg-energized');
				} else {
					InfoHandling.set('resetPasswordFailed',response.error.errorMessage,2000);
				}
			}
		});
	};

	$scope.confirmReset = function() {
		RESTFunctions.post({
			url:'reset-pass',
			data:'mail=' + $rootScope.inputs.resetMail + '&pass=' + $rootScope.inputs.resetPass + '&code=' + $rootScope.inputs.resetCode,
			callback: function(response) {
				if (!response.error) {
					localStorage['37-mToken'] = response.Token;
					$rootScope.login.token = localStorage['37-mToken'];
          			
					$rootScope.codeSent = false;
					InfoHandling.set('confirmResetSuccessful','Password reset successfully',2000,'bg-energized');

					$location.path('/polls');
				} else {
					InfoHandling.set('confirmResetFailed',response.error.errorMessage,2000);
				}
			}
		});
	};
});