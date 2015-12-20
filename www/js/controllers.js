angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal) {

})

.controller('signinCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = {
    email: 'example@mail.com',
    password: '0000'
  };

  $scope.signin = function() {
    LoginService.signin($scope.data.email, $scope.data.password)
    .then(function(data) {
      $state.go('main.profile.main');
    },function(error) {
      $ionicPopup.alert({
        title: 'Login failed!',
        template: err
      });
    });
  };
})

.controller('signupCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = LoginService.data;

  $scope.signup = function() {
    LoginService.signup($scope.data.email, $scope.data.phone, $scope.data.type)
    .then(function(data) {
      console.log($scope.data.type);
      $state.go('signupConformation');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
  $scope.confirm = function() {
    LoginService.confirm($scope.data.code)
    .then(function(data) {
      $state.go('reg');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
})

.controller('regCtrl', function($scope, $state, $ionicPopup, ProfileService) {
  $scope.user = {};
  $scope.save = function() {
    ProfileService.save($scope.data)
    .then(function(data) {
      $state.go('main.profile.main');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
})

.controller('passwordRecoveryCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = LoginService.data;

  $scope.send = function() {
    LoginService.passwordRecovery($scope.data.email, $scope.data.phone, $scope.data.type)
    .then(function(data) {
      $state.go('passwordRecoveryConformation');
    },function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  };

  $scope.confirm = function() {
    LoginService.confirm($scope.data.code)
    .then(function(data) {
      $state.go('passwordReset');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };

  $scope.restore = function() {
    LoginService.passwordRestore($scope.data.password)
    .then(function(data) {
      $state.go('signin');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
})

.controller('helpCtrl', function($scope) {

})

.controller('tripsCtrl', function($scope, Trips) {
  $scope.trips = Trips.all();
})

.controller('tripCtrl', function($scope, $stateParams, Trips) {
  $scope.data = Trips.get($stateParams.id);
})
//cordova plugin add cordova-plugin-file-transfer
//cordova plugin add com-sarriaroman-photoviewer
//cordova plugin add cordova-plugin-imagepicker
.controller('profileMainCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profilePasswordCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profilePassCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
});
