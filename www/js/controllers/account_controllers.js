angular.module('account.controllers',[])


.controller('LoginController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location) {

  //Check if the existing token is valid
  $scope.verifyToken = function() {
    $rootScope.checkingLogin = true;
    RESTFunctions.post({
      url:'login/verify',
      data:'Token=' + localStorage['37-mToken'],
      callback: function(response) {
        $rootScope.checkingLogin = false;
        if (response.status === 0) {
          //If token isn't valid, remove it from localStorage
          localStorage.removeItem('37-mToken');
        } else {
          //If token is valid proceed to the main screen
          $rootScope.login.token = localStorage['37-mToken'];
          $location.path('/polls');
        }
      }
    });
  };
  $scope.verifyToken();
  
  //Give focus to the password field
  $scope.focusPassword = function() {
    document.getElementById("login-password-input").focus();
  };

  //Sends a login request to the API with mail and pass as parameters
  $scope.login = function() {
    $rootScope.checkingLogin = true;
    RESTFunctions.post({
      url:'login',
      data:'mail=' + $rootScope.inputs.loginMail + '&pass=' + $rootScope.inputs.loginPass,
      callback: function(response) {
        $rootScope.checkingLogin = false;
        if (response.error) {
          //Display an error message
          InfoHandling.set('loginFailed',response.error.errorMessage,2000);
        } else {
          //Display a success message
          InfoHandling.set('loginSuccessful', 'Logged in successfully',2000,'bg-energized');
          //Store the token in localStorage and $rootScope
          localStorage['37-mToken'] = response.Token;
          $rootScope.login.token = response.Token;
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
          $rootScope.login.token = response.Token;
          //Set the user to firstTime user
          localStorage['37-mFirstTime'] = '1';
          $rootScope.login.firstTime = localStorage['37-mFirstTime'];
          //Redirect user to main screen
          $location.path('/polls');
        }
      }
    });
  };


  //*WIP Grab the facebook account info
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