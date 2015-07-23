angular.module('poll.controllers',[])


.controller('PollsController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location) {

  //Remove the first time user overlay
  $scope.removeOverlay = function() {
    $rootScope.login.firstTime = '0';
    localStorage['37-mFirstTime'] = '0';
  };

  //Create a new poll
  $scope.createPoll = function() {

    //Check if the input is empty
    if ($rootScope.inputs.createPollTitle === undefined || $rootScope.inputs.createPollTitle === '') {
      //Display an error message
      InfoHandling.set('createPollFailed',"You can't leave the question empty.",2000);
    } else {
      //Iterate through selected groups of friends and pull the ids out
      for (x in $rootScope.data.addPoll.friends){
        //Push the id to ids array
        $rootScope.data.addPoll.friendIds.push($rootScope.data.addPoll.friends[x].friendId);
      }

      //Iterate through selected groups of friends and pull the ids out
      for (y in $rootScope.data.addPoll.groups){
        //Push the id to ids array
        $rootScope.data.addPoll.groupIds.push($rootScope.data.addPoll.groups[y].groupId);
      }

      RESTFunctions.post({
        url:'leave-question',
        data:'Token=' + $rootScope.login.token + '&Title=' + $rootScope.inputs.createPollTitle + '&Groups=' + $rootScope.data.addPoll.groupIds.toString() + '&Users=' + $rootScope.data.addPoll.friendIds.toString(),
        callback: function(response) {
          if (response.error) {
            //Display an error message
            InfoHandling.set('createPollFailed',response.error.errorMessage,2000);
          } else {
            //Display a success message
            InfoHandling.set('createPollSuccessful', 'Poll created.',2000,'bg-energized');

            //Refresh the list of polls to properly display the newly created one
            $rootScope.getPollList();
            
            //Redirect user to main screen
            $location.path('/polls');
          }
        }
      });
    }
  };


  //Grab the list of polls (can also trigger on pull-to-refresh)
  $rootScope.getPollList = function(page) {

    RESTFunctions.post({
      url:'get-question-list',
      data:'Token=' + $rootScope.login.token + '&page=' + (page === undefined ? '0' : page),
      callback: function(response) {
        if (response.error) {
          //Dispaly an error message
          InfoHandling.set('getPollListFailed',response.error.errorMessage,2000);
        } else {
          //Clear the old polls and display new ones
          $rootScope.data.polls = [];
          $rootScope.data.polls = response.questions;
          
          //Stop the ion-refresher (pull-to-refresh) from spinning
          $scope.$broadcast('scroll.refreshComplete');
        }
      }
    });
  };

  
  //Grab a single poll item
  $scope.getPollItem = function(questionId, redirect) {

    //If we are supposed to navigate to pollDetails screen
    redirect === true ? null : $location.path('/pollDetails');

    RESTFunctions.post({
      url:'get-question',
      data:'Token=' + $rootScope.login.token + '&questionId=' + questionId,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('getPollItemFailed',response.error.errorMessage,2000);
        } else {
          //Store the poll details
          $rootScope.data.poll = response.question;
        }
      }
    });
  };

  
  //If you're on the /poll screen grab the list of polls
  $location.path() === '/polls' ? $rootScope.getPollList(0) : null;

  //Grab the list of polls every 30 seconds (if you're on the poll screen)
  setInterval(function () {
    $location.path() === '/polls' ? $rootScope.getPollList(0) : null;
  },30000);

  
  //Triggers when the user pulls down to refresh content
  $scope.onContentRefresh = function() {

    //Grab the list of polls
    $rootScope.getPollList();
  };


  //Vote on a specific poll
  $scope.voteOnPoll = function(pollId, vote) {

    RESTFunctions.post({
      url:'vote',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId + '&Vote=' + vote,
      callback: function(response) {
        if (response.error) {
          //Display an error message
          InfoHandling.set('voteOnPollfailed',response.error.errorMessage,2000,'bg-energized');
        } else {
          //Properly transition the voting options bars
          $scope.pollTransitionBars(pollId);
        }
      }
    });
  };

  //Get a specific poll and transition its' bars smoothy
  $scope.pollTransitionBars = function(pollId) {

    RESTFunctions.post({
      url:'get-question',
      data:'Token=' + $rootScope.login.token + '&questionId=' + pollId,
      callback: function(response) {
        if (!response.error) {
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