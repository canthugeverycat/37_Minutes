angular.module('comments.controllers',[])

.controller('CommentsController',function($scope, $rootScope, RESTFunctions, InfoHandling) {

	// getComments function is in the $rootScope (main_controllers.js file) because it gets called from a different controller


	//Leave a comment on a poll
	$scope.leaveComment = function(pollId) {
		console.log(pollId);
		var pollId = pollId;
		RESTFunctions.post({
			url:'leave-comment',
			data:'Token=' + $rootScope.login.token + '&questionId=' + pollId + '&Comment=' + $rootScope.inputs.newComment,
			callback: function(response) {
				if (response.error) {
					InfoHandling.set('leaveCommentFailed',response.error.errorMessage, 2000);
				} else {
					delete $rootScope.inputs.newComment;
					$rootScope.getComments(pollId);
					$rootScope.getPollList();
				}
			}
		});
	};
});