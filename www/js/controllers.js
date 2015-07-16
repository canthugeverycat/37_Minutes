angular.module('controllers',[])

.controller('refresher', function($scope, $http) {
  $scope.items = [1,2,3];
  $scope.doRefresh = function() {
    $http.get('/new-items')
     .success(function(newItems) {
       $scope.items = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
})

.controller('MainController', function($scope, $rootScope) {
  //Defining the variables
  $rootScope.inputs === undefined ? $rootScope.inputs = {} : null;
});