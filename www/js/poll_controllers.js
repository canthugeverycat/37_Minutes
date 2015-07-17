angular.module('controllers.poll',[])


.controller('PollController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location) {
  
  //Sends a login request to the API with mail and pass as parameters
  $scope.createPoll = function() {
    RESTFunctions.post({
      url:'leave-question',
      data:'mail=' + $rootScope.inputs.loginMail + '&pass=' + $rootScope.inputs.loginPass,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('createPollFailed',response.error.errorMessage,2000);
        } else {
          //Display a success message
          InfoHandling.set('createPollSuccessful', 'Poll created.',2000,'bg-energized');
          //Store the token in localStorage and $rootScope
          localStorage['37-mToken'] = response.Token;
          $rootScope.token = response.Token;
          //Redirect user to main screen
          $location.path('/polls');
        }
      }
    });
  };
})