angular.module('poll.controllers',[])


.controller('PollsController', function($scope, $rootScope , RESTFunctions, InfoHandling, $location, Upload, $ionicScrollDelegate) {
    $rootScope.loadingPolls = false;

    $scope.loadMorePolls = function() {
      $rootScope.data.polls === undefined ? null : $rootScope.getPollList(($rootScope.data.polls.length / 10), true);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMorePolls();
    });
  
  //Remove the first time user overlay
  $scope.removeOverlay = function() {
    $rootScope.login.firstTime = '0';
    localStorage['37-mFirstTime'] = '0';
  };

  //Create a new poll
  $scope.createPoll = function (files) {
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

      if (files && files.length) {

        //Execute Upload service if there is a file in the file model
        var file = files[0];
        Upload.upload({
            url: 'http://p.vz301.verteez.net/mobile-api/v1/leave-question',
            fields: {'Token': $rootScope.login.token,'Title':$rootScope.inputs.createPollTitle,'Groups':$rootScope.data.addPoll.groupIds.toString(),'Users':$rootScope.data.addPoll.friendIds.toString()},
            file:file,
            fileFormDataName:'photo'
        }).progress(function(evt) {
          //Store the current state of uploaded image
          $rootScope.imageUploadPercent = parseInt((evt.loaded/evt.total) * 100);
        }).success(function (response) {
          if (response.error) {
            //Display an error message
            InfoHandling.set('createPollFailed',response.error.errorMessage,2000);

            //Clear the data
            $rootScope.imageUploadPercent = 0;
            $rootScope.inputs.createPollTitle = '';
            $rootScope.data.addPoll.groupIds = [];
            $rootScope.data.addPoll.friendIds = [];
          } else {
            //Display a success message
            InfoHandling.set('createPollSuccessful', 'Poll created.',2000,'bg-energized');

            //Refresh the list of polls to properly display the newly created one
            $rootScope.getPollList();
            
            //Redirect user to main screen
            $location.path('/polls');

            //Clear the data
            $rootScope.imageUploadPercent = 0;
            $rootScope.inputs.createPollTitle = '';
            $rootScope.data.addPoll.groupIds = [];
            $rootScope.data.addPoll.friendIds = [];
          }
        }).error(function (response) {
            //console.log('Error:');
            //console.log(data);

            //Clear the data
            $rootScope.imageUploadPercent = 0;
            $rootScope.inputs.createPollTitle = '';
            $rootScope.data.addPoll.groupIds = [];
            $rootScope.data.addPoll.friendIds = [];
        })
      } else {

        //Execute RESTFunctions if there is no file in the file model
        RESTFunctions.post({
          url:'leave-question',
          data:'Token=' + $rootScope.login.token + '&Title=' + $rootScope.inputs.createPollTitle + '&Groups=' + $rootScope.data.addPoll.groupIds.toString() + '&Users=' + $rootScope.data.addPoll.friendIds.toString(),
          callback: function(response) {
            if (response.error) {
              //Display an error message
              InfoHandling.set('createPollFailed',response.error.errorMessage,2000);

              //Clear the data
              $rootScope.imageUploadPercent = 0;
              $rootScope.inputs.createPollTitle = '';
              $rootScope.data.addPoll.groupIds = [];
              $rootScope.data.addPoll.friendIds = [];
            } else {
              //Display a success message
              InfoHandling.set('createPollSuccessful', 'Poll created.',2000,'bg-energized');

              //Refresh the list of polls to properly display the newly created one
              $rootScope.getPollList();
              
              //Redirect user to main screen
              $location.path('/polls');

              //Clear the data
              $rootScope.imageUploadPercent = 0;
              $rootScope.inputs.createPollTitle = '';
              $rootScope.data.addPoll.groupIds = [];
              $rootScope.data.addPoll.friendIds = [];
            }
          }
        });
      }
    }
  };


  //Grab the list of polls (can also trigger on pull-to-refresh)
  $rootScope.getPollList = function(page, pushBool) {

    //Stop ionic infinite scroll from loading
    $rootScope.loaders.polls = true;

    RESTFunctions.post({
      url:'get-question-list',
      data:'Token=' + $rootScope.login.token + '&page=' + (page === undefined ? '0' : page),
      callback: function(response) {
        if (response.error) {
          //Dispaly an error message
          InfoHandling.set('getPollListFailed',response.error.errorMessage,2000);
        } else {
          //console.log('pushBool' + pushBool);
          if (pushBool === true) {
            //console.log($rootScope.data.polls);
            //console.log(response.questions);
            //Push the new data to polls array
            for (i = 0; i < response.questions.length; i++){
              $rootScope.data.polls.push(response.questions[i]);
              //console.log('pushing');
            }
          } else if (pushBool === undefined || pushBool === false) {
            //Clear the old polls and display new ones
            $rootScope.data.polls = [];
            $rootScope.data.polls = response.questions;
          }

          //Enable ionic infinite scroll
          $rootScope.loaders.polls = false;
          
          //Stop the ion-refresher (pull-to-refresh) from spinning
          $scope.$broadcast('scroll.refreshComplete');

          //Refresh the view
          $ionicScrollDelegate.resize();
        }
      }
    });
  };
 
  //If you're on the /poll screen grab the list of polls
  $location.path() === '/polls' ? $rootScope.getPollList(0) : null;

  //Grab the list of polls every 30 seconds (if you're on the poll screen)
  setInterval(function () {
    $location.path() === '/polls' && $rootScope.data.polls.length < 11 ? $rootScope.getPollList(0) : null;
  },30000);

  
  //Triggers when the user pulls down to refresh content
  $scope.onContentRefresh = function() {

    //Grab the list of polls
    $rootScope.getPollList();
  };

  //Get a specific poll and transition its' bars smoothy
  $rootScope.pollTransitionBars = function(pollId) {

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