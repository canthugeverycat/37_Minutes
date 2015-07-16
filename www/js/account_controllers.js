angular.module('controllers.account',[])


.controller('LoginController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location) {
  
  //Give focus to the password field
  $scope.focusPassword = function() {
    document.getElementById("login-password-input").focus();
  };

  //Sends a login request to the API with mail and pass as parameters
  $scope.login = function() {
    RESTFunctions.post({
      url:'login',
      data:'mail=' + $rootScope.inputs.loginMail + '&pass=' + $rootScope.inputs.loginPass,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('loginFailed',response.error.errorMessage,2000);
        } else {
          //Display a success message
          InfoHandling.set('loginSuccessful', 'Logged in successfully',2000,'bg-calm');
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

.controller('SignupController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location, ngFB) {
  
  //Give focus to an input field
  $scope.focusField = function(index) {
    document.getElementsByClassName('register-input')[index].focus();
  };

  //Sends a login request to the API with mail and pass as parameters
  $scope.signUp = function() {
    RESTFunctions.post({
      url:'register',
      data:'mail=' + $rootScope.inputs.signUpMail + '&pass=' + $rootScope.inputs.signUpPass + '&firstName=' + $rootScope.inputs.signUpFirstName + '&lastName=' + $rootScope.inputs.signUpLastName,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('signUpFailed',response.error.errorMessage,2000);
        } else {
          //Display a success message
          InfoHandling.set('signUpSuccessful', 'Logged in successfully',2000,'bg-calm');
          //Store the token in localStorage and $rootScope
          localStorage['37-mToken'] = response.Token;
          $rootScope.token = response.Token;
          //Redirect user to main screen
          $location.path('/polls');
        }
      }
    });
  };

  $scope.fbLogin = function() {
    ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
      function (response) {
          if (response.status === 'connected') {
              console.log('Facebook login succeeded');
              $scope.closeLogin();
          } else {
              alert('Facebook login failed');
          }
      }
    );
  };
})