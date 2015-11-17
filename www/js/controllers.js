angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, LoginService, $ionicPopup, $state) {
	$scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('profileController.main');
        }).error(function(data) {
            $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };
})
   
.controller('signupCtrl', function($scope) {

})

.controller('profileMainCtrl', function($scope,ProfileService) {
	$scope.user = ProfileService.profile;
})
   
.controller('profileAdditionalCtrl', function($scope,ProfileService) {
	$scope.user = ProfileService.profile;
})
   
.controller('profilePassCtrl', function($scope,ProfileService) {
	$scope.user = ProfileService.profile;
})

.controller('profileAddressCtrl', function($scope,ProfileService) {
	$scope.user = ProfileService.profile;
});


    