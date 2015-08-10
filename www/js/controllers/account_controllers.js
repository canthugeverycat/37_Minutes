angular.module('account.controllers',[])


.controller('LoginController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location) {

  //Check if the existing token is valid
  $scope.verifyToken = function() {

    //Display a spinner on login button
    $rootScope.checkingLogin = true;

    RESTFunctions.post({
      url:'login/verify',
      data:'Token=' + localStorage['37-mToken'],
      callback: function(response) {

        //Hide the spinner
        $rootScope.checkingLogin = false;

        if (response.status === 0) {
          //If token isn't valid, remove it from localStorage
          localStorage.removeItem('37-mToken');
        } else {
          //If token is valid store it in $rootScope and proceed to the main screen
          $rootScope.login.token = localStorage['37-mToken'];
          $location.path('/polls');
        }
      }
    });
  };
  //Call it on initialization
  $scope.verifyToken();
  
  //Give focus to the password field (triggers when the user hits enter on their keyboard)
  $scope.focusPassword = function() {
    document.getElementById("login-password-input").focus();
  };

  //Logs the user in the app
  $scope.login = function() {

    //Display a spinner on login button
    $rootScope.checkingLogin = true;

    RESTFunctions.post({
      url:'login',
      data:'mail=' + $rootScope.inputs.loginMail + '&pass=' + $rootScope.inputs.loginPass,
      callback: function(response) {
        //Hide the spinner
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
  
  //Give focus to an input field (triggers when the user hits the enter key)
  $scope.focusField = function(index) {
    document.getElementsByClassName('register-input')[index].focus();
  };

  //Sends out an SMS code to verify the email

  $scope.sendSMS = function() {
    RESTFunctions.post({
      url:'register/send-code',
      data:'mail=' + $rootScope.inputs.smsEmail,
      callback: function(response) {
        if (!response.error) {
          $rootScope.codeSent = true;
          InfoHandling.set('sendSMSFailed',response.message, 2000, 'bg-energized');
        } else {
          InfoHandling.set('sendSMSFailed',response.error.errorMessage, 2000);
        }
      }
    });
  };

  //Registers a user in the app
  $scope.signUp = function() {

    RESTFunctions.post({
      url:'register',
      data:'mail=' + $rootScope.inputs.signUpMail + '&pass=' + $rootScope.inputs.signUpPass + '&firstName=' + $rootScope.inputs.signUpFirstName + '&lastName=' + $rootScope.inputs.signUpLastName + '&code=' + $rootScope.inputs.signUpSms,
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
          
          //Recognize the user as a first time user and show him the "tutorial overlay"
          localStorage['37-mFirstTime'] = '1';
          $rootScope.login.firstTime = localStorage['37-mFirstTime'];
          
          //Redirect user to main screen
          $location.path('/cardOne');
        }
      }
    });
  };


  //Grab the facebook account info and register the user with it
  $scope.fbLogin = function() {
    ngFB.login({scope: 'email'}).then(
      function (response) {
          if (response.status === 'connected') {
              $scope.closeLogin();
          } else {
              alert('Facebook login failed');
          }
      }
    );
  };
})