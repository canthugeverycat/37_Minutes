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
            $rootScope.getPollList();
            //Display a success message
            InfoHandling.set('createPollSuccessful', 'Poll created.',2000,'bg-energized');
            //Redirect user to main screen
            $location.path('/polls');
          }
        }
      });
    }
  };


  //Grab the list of polls
  $rootScope.getPollList = function(page) {
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
          InfoHandling.set('getPollItemFailed',response.error.errorMessage,2000);
        } else {
          console.log('Question object:')
          console.log(response.question);
          $rootScope.data.poll = response.question;
        }
      }
    });
  };

  
  //If you're on the /poll screen grab the list of polls
  $location.path() === '/polls' ? $rootScope.getPollList(0) : null;
  setInterval(function () {
    $location.path() === '/polls' ? $rootScope.getPollList(0) : null;
  },30000);

  
  //Triggers when the user pulls down to refresh content
  $scope.onContentRefresh = function() {
    $rootScope.getPollList();
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

  //Vote on a specific poll
  $scope.voteOnPoll = function(pollId, vote) {
    RESTFunctions.post({
      url:'vote',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId + '&Vote=' + vote,
      callback: function(response) {
        if (response.error) {
          InfoHandling.set('voteOnPollfailed',response.error.errorMessage,2000,'bg-energized');
        } else {
          console.log('Voting ' + vote + ':');
          console.log(response);
          $scope.pollTransitionBars(pollId);
        }
      }
    });
  };

  //Get a specific poll and transition its' bars
  $scope.pollTransitionBars = function(pollId) {
    RESTFunctions.post({
      url:'get-question',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId,
      callback: function(response) {
        if (response.error) {
          //There's been an error
        } else {
          //Grab the data from the requested poll and update the corresponding poll array item with it
          //So we can smoothly animate the bars without touching the DOM
          for (i = 0; i < $rootScope.data.polls.length; i++) {
            if ($rootScope.data.polls[i].questionId === pollId) {
              $rootScope.data.polls[i].votesNo = response.question.votesNo;
              $rootScope.data.polls[i].votesYes = response.question.votesYes;
              $rootScope.data.polls[i].userVoted = response.question.userVoted;
              $rootScope.data.polls[i].userVotedNo = response.question.userVotedNo;
              $rootScope.data.polls[i].userVotedYes = response.question.userVotedYes;
              $rootScope.data.polls[i].votesCount = response.question.votesCount;
              $rootScope.data.polls[i].votesNoCount = response.question.votesNoCount;
              $rootScope.data.polls[i].votesYesCount = response.question.votesYesCount;
            }
          }
        }
      }
    });
  };
})