angular.module('poll.controllers',[])


.controller('PollsController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location) {
  
  //Create a new poll
  $scope.createPoll = function() {
    if ($rootScope.inputs.createPollTitle === undefined || $rootScope.inputs.createPollTitle === '') {
      InfoHandling.set('createPollFailed',"You can't leave the question empty.",2000);
      console.log('poll empty');
    } else {
      RESTFunctions.post({
        url:'leave-question',
        data:'Token=' + $rootScope.login.token + '&Title=' + $rootScope.inputs.createPollTitle,
        callback: function(response) {
          if (response.error) {
            //Display an error message
            InfoHandling.set('createPollFailed',response.error.errorMessage,2000);
          } else {
            $scope.getPollList();
            //Display a success message
            InfoHandling.set('createPollSuccessful', 'Poll created.',2000,'bg-energized');
            //Redirect user to main screen
            $location.path('/polls');
          }
        }
      });
    }
  };

  //Grab the list of polls from the database
  $scope.getPollList = function(page) {
    RESTFunctions.post({
      url:'get-question-list',
      data:'Token=' + $rootScope.login.token + '&page=' + (page === undefined ? '0' : page),
      callback: function(response) {
        if (response.error) {
          InfoHandling.set('getPollListFailed',response.error.errorMessage,2000);
        } else {
          $rootScope.data.polls = [];
          //Place the data from response in rootScope
          $rootScope.data.polls = response.questions;
          console.log('Questions array:');
          console.log(response.questions);
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        }
      }
    });
  };

  //Grab a single poll item
  $scope.getPollItem = function(questionId) {
    $location.path('/pollDetails');
    RESTFunctions.post({
      url:'get-question',
      data:'Token=' + $rootScope.login.token + '&questionId=' + questionId,
      callback: function(response) {
        if (response.error) {
          InfoHandling.set('getPollItemFailed',response.error.errrorMessage,2000);
        } else {
          console.log('Question object:')
          console.log(response.question);
          $rootScope.data.poll = response.question;
        }
      }
    });
  };

  //If you're on the /poll screen grab the list of polls
  $location.path() === '/polls' ? $scope.getPollList(0) : null;
  setInterval(function () {
    $location.path() === '/polls' ? $scope.getPollList(0) : null;
  },30000);

  //Triggers when the user pulls down to refresh content
  $scope.onContentRefresh = function() {
    $scope.getPollList();
  };



  // //Testing infinite scroll
  // $scope.items = [];
  // $scope.loadMore = function() {
  //   console.log('infinite triggered');
  //     $scope.$broadcast('scroll.infiniteScrollComplete');
  // };

  // $scope.$on('$stateChangeSuccess', function() {
  //   $scope.loadMore();
  // });
})