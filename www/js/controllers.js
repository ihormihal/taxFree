angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $state, AuthService) {

  $scope.logout = function(){
    AuthService.logout();
  };

  $scope.$on('auth-logout', function(e, rejection) {
    $state.go('login');
  });

  $scope.$on('auth-login-required', function(e, rejection) {
    AuthService.refresh();
  });

  $scope.$on('auth-login-failed', function(e, rejection) {
    $state.go('login');
  });

})

.controller('loginCtrl', function($scope, $state, $ionicPopup, AuthService, RegService) {

  $scope.user = {
    username: 'tsvetok77@yandex.ru',
    password: 'PArol12345'
  };

  $scope.$on('auth-login', function(e, rejection) {
    $state.go('main.user.profile');
  });

  $scope.$on('auth-login-failed', function(event, data){
    $ionicPopup.alert({
      title: 'Login failed!',
      template: data
    });
  });

  $scope.login = function() {
    AuthService.login($scope.user);
  };
})

.controller('regCtrl', function($scope, $state, $ionicPopup, RegService) {

  if(!window.localStorage['token']){
    RegService.getToken();
  }

  //initialize every time when view is called
  $scope.data = RegService.data;

  $scope.stepOne = function() {
    RegService.data = $scope.data;
    RegService.one()
    .then(function(data) {
      RegService.data.user = data.user;
      $state.go('regTwo');
    },function(error) {
      alert(error);
    });
  };

  $scope.stepTwo = function() {
    RegService.data.code = $scope.data.code;
    RegService.two()
    .then(function(data) {
      $state.go('regThree');
    },function(error) {
      alert(error);
    });
  };

  $scope.stepThree = function(){
    RegService.data.password = $scope.data.password;
    RegService.data.before_fs = $scope.data.before_fs;
    RegService.data.fs_name = $scope.data.fsname;
    RegService.data.address = $scope.data.address;
    RegService.three()
    .then(function(data) {
      $state.go('main.user.profile');
    },function(error) {
      alert(error);
    });
  };
})

.controller('passwordRecoveryCtrl', function($scope, $state, $ionicPopup, RegService) {
  $scope.data = RegService.data;

  $scope.send = function() {
    RegService.passwordRecovery($scope.data.email, $scope.data.phone, $scope.data.type)
    .then(function(data) {
      $state.go('passwordRecoveryConformation');
    },function(data) {
      alert(error);
    });
  };

  $scope.confirm = function() {
    RegService.confirm($scope.data.code)
    .then(function(data) {
      $state.go('passwordReset');
    },function(error) {
      alert(error);
    });
  };

  $scope.restore = function() {
    RegService.passwordRestore($scope.data.password)
    .then(function(data) {
      $state.go('signin');
    },function(error) {
      alert(error);
    });
  };
})

.controller('userCtrl', function($scope, UserService, Catalog) {

  Catalog.getCountries()
  .then(function(data){
    $scope.countries = data;
  },function(error){
    alert(error);
  });

  $scope.user = UserService;
  $scope.update = function(){
    $scope.user.updateProfile($scope.user.profile);
  };
  $scope.doRefresh = function(){
    $scope.user.profile = UserService.getProfile();
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('helpCtrl', function($scope) {

})

.controller('tripsCtrl', function($scope, TripService) {
  TripService.getList()
  .then(function(data){
    $scope.trips = data;
  },function(error){
    alert(error);
  });
  $scope.doRefresh = function(){
    TripService.getList()
    .then(function(data){
      $scope.trips = data;
    },function(error){
      alert(error);
    });
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('tripCtrl', function($scope, $stateParams, $ionicConfig, TripService, CheckService) {
  $scope.trip = {};
  $scope.trip = TripService.getOne($stateParams.id);
  $scope.checks = CheckService.getList();
  $scope.doRefresh = function(){
    $scope.checks = CheckService.getList();
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('checksCtrl', function($scope, $ionicModal, CheckService) {
  $scope.checks = CheckService.getList();
  $scope.doRefresh = function(){
    $scope.checks = CheckService.getList();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $ionicModal.fromTemplateUrl('templates/checks/add-check.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.addCheck = function(){

  };

})

.controller('checkCtrl', function($scope, $stateParams, $ionicModal, CheckService) {
  $scope.check = CheckService.getOne($stateParams.id);

  $ionicModal.fromTemplateUrl('templates/checks/add-check.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

})

;
