angular.module('app.controllers', [])

/****************************************/
/******** PRIVATE APP CONTROLLER ********/
/****************************************/

.controller('AppCtrl', function($ionicPlatform, $rootScope, $scope, $state, $cordovaStatusbar, AuthService, Catalog) {

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
    try {
      if($cordovaStatusbar.isVisible()){
        $cordovaStatusbar.hide();
      }
    } catch (error) {
      console.log('hide statusBar');
      console.log(error);
    }
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

/****************************************/
/*********** LOGIN CONTROLLER ***********/
/****************************************/

.controller('loginCtrl', function($scope, $state, $ionicPopup, $cordovaToast, $cordovaStatusbar, AuthService, Catalog) {

  $scope.user = {
    username: 'tsvetok77@yandex.ru',
    password: 'PArol12345'
  };

  $scope.login = function() {
    AuthService.login($scope.user);
  };

  $scope.$on('auth-login', function(event, data) {
    $state.go('main.user.profile');
    try {
      if(!$cordovaStatusbar.isVisible()){
        $cordovaStatusbar.show();
        $cordovaStatusbar.styleHex('#e42112');
      }
    } catch (error) {
      console.log('show statusBar');
      console.log(error);
    }
  });

  $scope.$on('auth-login-failed', function(event, data) {
    $cordovaToast.show(angular.toJson(data), 'short', 'top');
  });

})

/********************************/
/******** REG CONTROLLER ********/
/********************************/

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

/*****************************************/
/******** PWD RECOVERY CONTROLLER ********/
/*****************************************/

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

/*********************************/
/******** USER CONTROLLER ********/
/*********************************/

.controller('userCtrl', function($scope, $ionicModal, $cordovaStatusbar, $cordovaToast, UserService, Catalog) {

  try {
    if(!$cordovaStatusbar.isVisible()){
      $cordovaStatusbar.show();
      $cordovaStatusbar.styleHex('#e42112');
    }
  } catch (error) {
    console.log('show statusBar');
    console.log(error);
  }

  $scope.user = UserService;
  $scope.update = function(){
    $scope.user.updateProfile($scope.user.profile)
    .then(function(){
      try {
        $cordovaToast.show(lngTranslate('toast_profile_updated'), 'short', 'top');
      } catch (error) {
        console.log(lngTranslate('toast_profile_updated'));
      }
      $scope.closeModal();
    },function(){
      try {
        $cordovaToast.show(error.data, 'short', 'top');
      } catch (error) {
        console.log(error.data);
      }
    })
  };
  $scope.doRefresh = function(){
    $scope.user.profile = UserService.getProfile();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $ionicModal.fromTemplateUrl('templates/user/edit.html', {
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

/***************************************/
/******** TRIP LIST CONTROLLER ********/
/***************************************/

.controller('tripsCtrl', function($scope, $state, $ionicModal, TripListService, TripService) {


  $scope.doRefresh = function(){
    TripListService.getList(true)
    .then(function(data){
      $scope.trips = data;
    },function(error){
      alert(error);
    });
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.doRefresh();

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

/****************************************/
/******** SINGLE TRIP CONTROLLER ********/
/****************************************/

.controller('tripCtrl', function($scope, $state, $stateParams, $ionicConfig, $cordovaDialogs, $cordovaToast, TripService) {

  TripService.getInfo($stateParams.id).then(function(){
    $scope.trip = TripService;
  },function(error){
    alert(error);
  });

  $scope.update = function(){
    $scope.trip.updateInfo($scope.trip.info);
  };

  $scope.remove = function(){
    $cordovaDialogs.confirm(
      lngTranslate('dialog_remove_trip_message'),
      lngTranslate('dialog_remove_trip_title'),
      [lngTranslate('yes'),lngTranslate('no')])
    .then(function(buttonIndex) {
      if(buttonIndex == 1){
        TripService.remove($scope.trip.info.id)
        .then(function(){
          try {
            $cordovaToast.show(lngTranslate('toast_trip_deleted'), 'short', 'top');
          } catch (error) {
            console.log(lngTranslate('toast_trip_deleted'));
          }
          $state.go('main.trips');
          //$state.transitionTo('main.trips', {}, {reload: true});
        },function(error){
          try {
            $cordovaToast.show(error, 'short', 'top');
          } catch (err) {
            console.log(error);
          }
        });
      }
    });
  };
})

/***************************************/
/******** CHECK LIST CONTROLLER ********/
/***************************************/

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

/*****************************************/
/******** SINGLE CHECK CONTROLLER ********/
/*****************************************/

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

/*********************************************/
/******** DECLARATION LIST CONTROLLER ********/
/*********************************************/

.controller('declarationsCtrl', function($scope, $ionicModal, declarationService) {
  $scope.declarations = declarationService.getList();
  $scope.doRefresh = function(){
    $scope.declarations = declarationService.getList();
    $scope.$broadcast('scroll.refreshComplete');
  };

})

/***********************************************/
/******** SINGLE DECLARATION CONTROLLER ********/
/***********************************************/

.controller('declarationCtrl', function($scope, $stateParams, $ionicModal, declarationService) {
  $scope.declaration = declarationService.getOne($stateParams.id);
  $scope.doRefresh = function(){
    $scope.declaration = declarationService.getOne($stateParams.id);
    $scope.$broadcast('scroll.refreshComplete');
  };
})

/**************************************/
/******** HELP PAGE CONTROLLER ********/
/**************************************/

.controller('helpCtrl', function($scope) {

})

/*****************************************/
/******** SETTINGS APP CONTROLLER ********/
/*****************************************/

.controller('settingsCtrl', function($rootScope, $scope, $ionicPopup, $cordovaDialogs, $timeout, $state) {
  $scope.clearCache = function(){

    $cordovaDialogs.confirm(
      lngTranslate('dialog_clear_cache_message'),
      lngTranslate('dialog_clear_cache_title'),
      [lngTranslate('yes'),lngTranslate('no')])
    .then(function(buttonIndex) {
      if(buttonIndex == 1){
        window.localStorage.clear();
        $rootScope.$broadcast('auth-logout');
      }
    });

  };
})

;