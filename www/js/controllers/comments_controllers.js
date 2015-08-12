angular.module('comments.controllers',[])

.controller('CommentsController',function($scope, $rootScope, RESTFunctions, InfoHandling, $location, $interval) {

	//$getComments() function is in the $rootScope (main_controllers.js file) because it gets called from a different controller

	//Leave a comment on a poll
	$scope.leaveComment = function(pollId) {

		//Show the loader
		$rootScope.loaders.leaveComment = true;

		//Check if the comment input field is empty
		if ($rootScope.inputs.newComment === undefined || $rootScope.inputs.newComment === '') {

			//Display an error message
			InfoHandling.set('leaveCommentFailed', "You can't send out an empty comment", 2000);

			//Hide the loader
			$rootScope.loaders.leaveComment = false;
		} else {
			//Store the parameter in a global var so we can use it in a callback
			var pollId = pollId;

			RESTFunctions.post({
				url:'leave-comment',
				data:'Token=' + $rootScope.login.token + '&questionId=' + pollId + '&Comment=' + $rootScope.inputs.newComment,
				callback: function(response) {
					//Hide the loader
					$rootScope.loaders.leaveComment = false;

					if (response.error) {
						InfoHandling.set('leaveCommentFailed',response.error.errorMessage, 2000);
					} else {

						//Clear the input field
						$rootScope.inputs.newComment = '';

						//Grab the comments for the poll and refresh the list of polls (so the number of comments is correctly displayed)
						$rootScope.getComments(pollId);
						$rootScope.getPollList();
					}
				}
			});
		}
	};

	//Replace comment symbols with emojis
	$rootScope.emojis = function() {
		//Go through poll comments
		for (i in $rootScope.data.pollComments){
			for (x in $rootScope.data.emojis){
				
				//Find a matching emoji code
				if ($rootScope.data.pollComments[i].comment.search($rootScope.data.emojis[x].trigger) !== -1) {
					
					//Replace it
					$rootScope.data.pollComments[i].comment = $rootScope.data.pollComments[i].comment.replace($rootScope.data.emojis[x].trigger, '<i class="ion-icon ' + $rootScope.data.emojis[x].code + '"></i>');
					
					//And update the comment element
					document.getElementsByClassName('comment')[i].innerHTML = $rootScope.data.pollComments[i].comment;

					//If digest is not in progress
					if(!$scope.$$phase) {
					  	//Refresh the digest cycle
						$scope.$apply();
					}
				}
			}
		}
	};

	//Check for some naughty emojis and replace them
	$interval(function() {
		$location.path() === '/comments' ? $rootScope.emojis() : null;
	},500);

	$rootScope.useEmoji = function(emoji) {
		$rootScope.inputs.newComment += emoji;
	};
});