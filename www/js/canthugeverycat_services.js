angular.module('canthugeverycat.services',['ngResource'])

/**
 * [Sets API url and custom methods.]
 * @return $resource [Angular's ngResource service used to send http requests to a remote server]
 * @param {string} APIurl Sets the path to the API
 */
.factory('RESTCalls', function ($resource) {
	APIurl = 'http://p.vz301.verteez.net/mobile-api/v1'
	return $resource(APIurl + '/:url/', null, {
		post: {
			//Defining the content-type header for POST so the server can recognize the data.
			method:'POST',	headers:{'Content-Type':'application/x-www-form-urlencoded'}
		}
	});
})

/**
 * @description Configures GET and POST requests that controller communicates with.
 * @param {object} x The object with request-specific parameters that gets passed to the service function
 */
.service('RESTFunctions', function (RESTCalls, $rootScope) {
	var RESTFunctions = {
		get: function(x) {
			RESTCalls.get({url:x.url},
			function (response) {
				return response.data;
			},
			function (responseerr) {
				x.error(responseerr);
			}).$promise.then(x.callback);
		},
		post: function(x) {
			RESTCalls.post({url:x.url},x.data,
			function(response) {
				return response.data;
			},
			function (responseerr) {
				x.error(responseerr);
			}).$promise.then(x.callback);
		}
	}
	return RESTFunctions;
})

.service('InfoHandling',function ($rootScope, $compile, $timeout, $location) {
	$rootScope.errors === undefined ? $rootScope.errors = {} : null;
	var InfoHandling = {
		set: function(key, message, time, color) {
			//If not provided, go to fallback color
			//Otherwise, set specified color
			color === undefined || color === '' ? $rootScope.errors.errorColor = 'bg-royal' : $rootScope.errors.errorColor = color;
			var newInfoElement = angular.element('<div class="info-message animate-footer-show ng-hide ' + $rootScope.errors.errorColor + '" ng-hide="$root.errors.' + key + ' === undefined" style=""><div class="info-title" ng-bind="$root.errors.' + key + '"></div></div>');
			angular.element(document.body).append(newInfoElement);
			$compile(newInfoElement)($rootScope);

			//Set the message
			$timeout(function() {$rootScope.errors[key] = message;},1);
			
			$timeout(function(){
				delete $rootScope.errors[key];
				delete $rootScope.errorColor;
				delete newInfoElement;
				$timeout(function() {angular.element(document.querySelector('.info-message.animate-footer-show')).remove();},500);
				$rootScope.$digest();
			}, time);
		}
	}
	return InfoHandling;
});