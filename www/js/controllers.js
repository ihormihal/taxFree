angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/signin.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('signinCtrl', function($scope, SignInService, $ionicPopup, $state) {
  $scope.data = {
    email: 'ihor.mihal@gmail.com',
    password: '0000'
  };

  $scope.signin = function() {
    SignInService.signin($scope.data.email, $scope.data.password).success(function(data) {
      $state.go('app.profile.main');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your login or password!'
      });
    });
  };
})

.controller('signupCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = LoginService.data;

  $scope.signup = function() {
    LoginService.signup($scope.data.email, $scope.data.phone, $scope.data.type).success(function(data) {
      console.log($scope.data.type);
      $state.go('app.signupConformation');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  };
  $scope.confirm = function() {
    LoginService.confirm($scope.data.code).success(function(data) {
      $state.go('app.reg');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  };
})


.controller('regCtrl', function($scope, $state, $ionicPopup, ProfileService, Upload, $timeout) {
  $scope.data = {

  };

  $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
      data: {file: file}
    });
    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0){
        $scope.errorMsg = response.status + ': ' + response.data;
      }
    }, function (evt) {
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  };

  $scope.save = function() {
    ProfileService.save($scope.data).success(function(data) {
      $state.go('app.profile.main');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  }
})

.controller('passwordRecoveryCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = LoginService.data;

  $scope.send = function() {
    LoginService.passwordRecovery($scope.data.email, $scope.data.phone, $scope.data.type).success(function(data) {
      $state.go('app.passwordRecoveryConformation');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  };

  $scope.confirm = function() {
    LoginService.confirm($scope.data.code).success(function(data) {
      $state.go('app.passwordRestore');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  };

  $scope.restore = function() {
    LoginService.passwordRestore($scope.data.password).success(function(data) {
      $state.go('app.signin');
    }).error(function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
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
  $scope.data = {};
  $scope.id = $stateParams.id;
  $scope.data = Trips.get($scope.id);
})

.controller('profileMainCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profileAdditionalCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profilePassCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profileAddressCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
});
