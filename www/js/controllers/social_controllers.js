angular.module('social.controllers',[])

// .controller('FbCtrl',function($scope, $rootScope, $ionicModal, $timeout, ngFB) {
//   $scope.fbLogin = function () {
//       ngFB.login({scope: 'email'}).then(
//         function (response) {
//             if (response.status === 'connected') {
//                 console.log('Facebook login succeeded');
//                 $scope.facebookToken = response.authResponse.accessToken;
//                 $scope.closeLogin();
//             } else {
//                 alert('Facebook login failed');
//             }
//         });
//   };

//   $scope.getProfile = function() {
//     ngFB.api({path: '/me'}).then(function( res ) {
//       console.log('Success:');
//       console.log(res);
//       $rootScope.name = res.name;
//     });

//     ngFB.api({
//       path: '/me/picture',
//       params: {
//           redirect: false,
//           height: 300,
//           width: 300
//       }
//     }).then(function( res ) {
//       console.log('Success:');
//       console.log(res);
//       $rootScope.image = res.data.url;
//     });
//   };
// })