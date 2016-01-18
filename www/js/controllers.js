angular.module('app.controllers', [])

.controller('AppCtrl', function($ionicPlatform, $rootScope, $scope, $state, AuthService, Catalog) {

  if(!window.localStorage['countries']){
    Catalog.loadCountries();
  }else{
    $rootScope.countries = angular.fromJson(window.localStorage['countries']);
  }

  if(!window.localStorage['transports']){
    Catalog.loadTransports();
  }else{
    $rootScope.transports = angular.fromJson(window.localStorage['transports']);
  }

  $scope.logout = function(){
    AuthService.logout();
  };

  $scope.$on('auth-logout', function(event, data) {
    $state.go('login');
  });

  $scope.$on('auth-login-required', function(event, data) {
    AuthService.refresh();
  });

  $scope.$on('auth-login-failed', function(event, data) {
    $state.go('login');
  });

  $scope.exit = function() {
    ionic.Platform.exitApp();
  };

})

.controller('loginCtrl', function($scope, $state, $ionicPopup, AuthService, Catalog) {

  $scope.user = {
    username: 'tsvetok77@yandex.ru',
    password: 'PArol12345'
  };

  $scope.login = function() {
    AuthService.login($scope.user);
  };

  $scope.$on('auth-login', function(event, data) {
    $state.go('main.user.profile');
  });

  $scope.$on('auth-login-failed', function(event, data) {
    window.plugins.toast.showWithOptions({
      message: angular.toJson(data),
      duration: "short",
      position: "top"
    });
  });

})

.controller('regCtrl', function($rootScope, $scope, $state, $ionicPopup, RegService) {

  //initialize every time when view is called
  $scope.data = RegService.data;

  $scope.stepOne = function() {
    RegService.data = $scope.data;
    if(window.localStorage['token']){
      RegService.one()
      .then(function(data) {
        RegService.data.user = data.user;
        $state.go('regTwo');
      });
    }else{
      RegService.getToken()
      .then(function(){
        RegService.one()
        .then(function(data) {
          RegService.data.user = data.user;
          $state.go('regTwo');
        });
      });
    }
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

  $scope.user = UserService;
  $scope.update = function(){
    $scope.user.updateProfile($scope.user.profile);
  };
  $scope.doRefresh = function(){
    $scope.user.profile = UserService.getProfile();
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('settingsCtrl', function($scope, $ionicPopup, $timeout, $state) {
  $scope.clearCache = function(){
    if(!navigator.notification){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Очистить кеш',
        template: 'Кеш приложения будет очищен. Вы будете перенаправлены на экран авторизации. Очистить?'
      });
      confirmPopup.then(function(res) {
        if(res){
          window.localStorage.clear();
          $state.go('login');
        }
      });
      return false;
    }
    navigator.notification.confirm(
      'Кеш приложения будет очищен. Вы будете перенаправлены на экран авторизации. Очистить?',
      function(index){
        switch (index) {
          case 1:
            window.localStorage.clear();
            $state.go('login');
            break;
          case 2:
            break;
          default:
            break;
        }
      },
      'Подтвердите действие',
      ['Да','Нет']
    );
  };
})

.controller('helpCtrl', function($scope) {

})

.controller('tripsCtrl', function($scope, $state, $ionicModal, TripListService, TripService) {

  TripListService.getList()
  .then(function(data){
    $scope.trips = data;
  },function(error){
    alert(error);
  });
  $scope.doRefresh = function(){
    TripListService.getList()
    .then(function(data){
      $scope.trips = data;
    },function(error){
      alert(error);
    });
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.trip = {
    info: {
      time_start: 61200,
      time_end: 61200
    }
  };

  $ionicModal.fromTemplateUrl('templates/trips/add.html', {
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

  $scope.addTrip = function(){
    $scope.openModal();
  };

  $scope.create = function(){
    TripService.create($scope.trip.info)
    .then(function(data){
      if(data.id){
        $scope.closeModal();
        $state.go('main.trip.info', {id: data.id});
      }
    },function(){
      alert(error);
    });
  };

})

.controller('tripCtrl', function($scope, $stateParams, $ionicConfig, TripService) {

  TripService.getInfo($stateParams.id).then(function(){
    $scope.trip = TripService;
  },function(error){
    alert(error);
  });

  $scope.update = function(){
    $scope.trip.updateInfo($scope.trip.info);
  };

})

.controller('checksCtrl', function($scope, $ionicModal, CheckService) {
  $scope.checks = CheckService.getList();
  $scope.doRefresh = function(){
    $scope.checks = CheckService.getList();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $ionicModal.fromTemplateUrl('templates/checks/add.html', {
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

  $ionicModal.fromTemplateUrl('templates/checks/add.html', {
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

.controller('declarationsCtrl', function($scope, $ionicModal, declarationService) {
  $scope.declarations = declarationService.getList();
  $scope.doRefresh = function(){
    $scope.declarations = declarationService.getList();
    $scope.$broadcast('scroll.refreshComplete');
  };

})

.controller('declarationCtrl', function($scope, $stateParams, $ionicModal, declarationService) {
  $scope.declaration = declarationService.getOne($stateParams.id);
  $scope.doRefresh = function(){
    $scope.declaration = declarationService.getOne($stateParams.id);
    $scope.$broadcast('scroll.refreshComplete');
  };
})

;
