angular.module('app.controllers', [])

/****************************************/
/******** PRIVATE APP CONTROLLER ********/
/****************************************/

.controller('AppCtrl', function($ionicPlatform, $rootScope, $scope, $state, $cordovaStatusbar, AuthService, Catalog) {

  try {
    if(!$cordovaStatusbar.isVisible()){
      $cordovaStatusbar.show();
      $cordovaStatusbar.styleHex('#e42112');
    }
  } catch (error) {
    console.log('show statusBar');
    console.log(error);
  }


  if(!window.localStorage['countries']){
    Catalog.query({name: 'country'}, function(data){
      window.localStorage['countries'] = angular.toJson(data);
    },function(error){
      console.log(error);
    });
  }else{
    $rootScope.countries = angular.fromJson(window.localStorage['countries']);
  }

  if(!window.localStorage['transports']){
    Catalog.query({name: 'transport'}, function(data){
      window.localStorage['transports'] = angular.toJson(data);
    },function(error){
      console.log(error);
    });
  }else{
    $rootScope.transports = angular.fromJson(window.localStorage['transports']);
  }

  $scope.logout = function(){
    AuthService.logout();
  };

  $scope.exit = function() {
    ionic.Platform.exitApp();
  };

})

/****************************************/
/*********** LOGIN CONTROLLER ***********/
/****************************************/

.controller('loginCtrl', function($scope, $state, $ionicPopup, Toast, $cordovaStatusbar, AuthService) {

  try {
    if($cordovaStatusbar.isVisible()){
      $cordovaStatusbar.hide();
    }
  } catch (error) {
    console.log('hide statusBar');
    console.log(error);
  }

  $scope.user = {
    username: 'tsvetok77@yandex.ru',
    password: 'PArol12345'
  };

  $scope.login = function() {
    AuthService.login($scope.user);
  };

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

.controller('userCtrl', function($rootScope, $scope, $ionicModal, Toast, User) {

  $scope.user = {};
  $scope.user.profile = User.get();

  $scope.update = function(){
    User.update($scope.user.profile, function(){
      Toast.show(lngTranslate('toast_profile_updated'));
      $scope.closeModal();
    },function(error){
      Toast.show(error);
    })
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

.controller('tripsCtrl', function($scope, $state, $ionicModal, Trips, Trip, Toast) {


  Trips.get({},function(data){
    $scope.trips = data.trips;
  },function(error){
    Toast.show(error);
  });

  $scope.doRefresh = function(){
    Trips.get({}, function(data){
      $scope.trips = data.trips;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error){
      Toast.show(error);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.trip = {
    data: {
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
    Trip.save($scope.trip.data, function(data){
      $scope.closeModal();
      Toast.show(lngTranslate('toast_trip_created'));
      $state.go('main.trip.data', {id: data.id});
    }, function(error){
      Toast.show(error);
    })
  };

})

/****************************************/
/******** SINGLE TRIP CONTROLLER ********/
/****************************************/

.controller('tripCtrl', function($scope, $state, $stateParams, $cordovaDialogs, Trip, Toast) {

  Trip.get({id: $stateParams.id},function(data){
    $scope.trip = data;
  },function(error){
    Toast.show(error);
  });

  $scope.update = function(){
    Trip.update($scope.trip.data, function(){
      Toast.show(lngTranslate('toast_trip_updated'));
    },function(error){
      Toast.show(error);
    });
  };

  $scope.delete = function(){
    $cordovaDialogs.confirm(
      lngTranslate('dialog_remove_trip_message'),
      lngTranslate('dialog_remove_trip_title'),
      [lngTranslate('yes'),lngTranslate('no')])
    .then(function(buttonIndex) {
      if(buttonIndex == 1){
        Trip.delete($scope.trip.id, function(){
          Toast.show(lngTranslate('toast_trip_deleted'));
          $state.go('main.trips');
        },function(error){
          Toast.show(error);
        });
      }
    });
  };

})

/***************************************/
/******** CHECK LIST CONTROLLER ********/
/***************************************/

.controller('checksCtrl', function($scope, $ionicModal, Checks, Check) {

  $scope.checks = [];

  Checks.get({},function(data){
    $scope.checks = data.checks;
  },function(error){
    Toast.show(error);
  });

  $scope.doRefresh = function(){
    Checks.get({}, function(data){
      $scope.checks = data.checks;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error){
      Toast.show(error);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  // $scope.complete = function(){
  //   for(var i = 0; i < $scope.checks.length; i++){
  //     Trip.get({id: $scope.checks[i].trip}, function(data){

  //     },function(){
  //       Toast.show(error);
  //     });
  //   }
  // };


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

  $scope.update = function(){

  };

  $scope.create = function(){

  };

})

/*****************************************/
/******** SINGLE CHECK CONTROLLER ********/
/*****************************************/

.controller('checkCtrl', function($scope, $stateParams, $ionicModal, Check) {

  Check.get({id: $stateParams.id}, function(data){
    $scope.check = data;
  },function(error){
    Toast.show(error);
  });

  $scope.update = function(){
    Check.update($scope.check.data, function(){
      Toast.show(lngTranslate('toast_check_updated'));
    },function(error){
      Toast.show(error);
    });
  };

  $scope.delete = function(){
    $cordovaDialogs.confirm(
      lngTranslate('dialog_remove_trip_message'),
      lngTranslate('dialog_remove_trip_title'),
      [lngTranslate('yes'),lngTranslate('no')])
    .then(function(buttonIndex) {
      if(buttonIndex == 1){
        Check.delete($scope.check.id, function(){
          Toast.show(lngTranslate('toast_check_deleted'));
          $state.go('main.checks');
        },function(error){
          Toast.show(error);
        });
      }
    });
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

  $scope.update = function(){

  };

  $scope.create = function(){

  };

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