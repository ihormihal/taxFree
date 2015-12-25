angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $state, AuthenticationService) {

  $scope.login = function(){
    AuthenticationService.login({username:'ihormihal',password: '1234'});
  };

  $scope.logout = function(){
    AuthenticationService.logout();
  };

  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    $state.go('signin');
  });

})

.controller('signinCtrl', function($scope, $state, $ionicPopup, LoginService, AuthenticationService) {

  $scope.data = {
    email: 'user@example.com',
    password: 'password'
  };

  $scope.$on('event:auth-loginConfirmed', function(event, data){
    console.log('Loginned!');
  });

  $scope.signin = function() {
    AuthenticationService.login({
      client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
      client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk',
      grant_type: 'password',
      username: $scope.data.email,
      password: $scope.data.password
    })
    .then(function(data) {
      $state.go('main.user.profile');
    },function(error) {
      $ionicPopup.alert({
        title: 'Login failed!',
        template: error
      });
    });
  };
})

.controller('signupCtrl', function($scope, $state, $ionicPopup, AuthenticationService) {
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

.controller('regCtrl', function($scope, $state, $ionicPopup, UserService) {
  $scope.user = {};
  $scope.save = function() {
    UserService.save($scope.data)
    .then(function(data) {
      $state.go('main.user.profile');
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

.controller('tripsCtrl', function($scope, Trip) {
  $scope.trips = Trip.query();
  $scope.doRefresh = function(){
    $scope.trips = Trip.query();
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('tripCtrl', function($scope, $stateParams, $ionicConfig, Trip, Check) {
  $scope.trip = {};
  Trip.get({id: $stateParams.id}).$promise.then(function(data){
    $scope.trip = data;
    $scope.trip.from_time = new Date(data.from_time);
    $scope.trip.to_time = new Date(data.to_time);
    console.log('Trip #'+$scope.trip.id+' loaded');
  },function(error){
    alert(error);
  });
  $scope.checks = Check.query();
  $scope.doRefresh = function(){
    $scope.checks = Check.query();
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('userCtrl', function($scope, User) {
  User.get().$promise.then(function(data){
    $scope.user = data;
    $scope.user.birthday = new Date(data.birthday);
    $scope.user.passport_validiti = new Date(data.passport_validiti);
  },function(error){
    alert(error);
  });

})

.controller('checksCtrl', function($scope, $ionicModal, Check) {
  $scope.checks = Check.query();
  $scope.doRefresh = function(){
    $scope.checks = Check.query();
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

.controller('checkCtrl', function($scope, $stateParams, $ionicModal, Check) {
  $scope.check = {};
  Check.get({id: $stateParams.id}).$promise.then(function(data){
    $scope.check = data;
    console.log('Check #'+$scope.check.id+' loaded');
  },function(error){
    alert(error);
  });

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
