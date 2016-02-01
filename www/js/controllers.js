angular.module('app.controllers', [])

/****************************************/
/*********** START CONTROLLER ***********/
/****************************************/

.controller('startCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
  try {
    if($cordovaStatusbar.isVisible()){
      $cordovaStatusbar.hide();
    }
  } catch (error) {
    console.log('hide statusBar');
    console.log(error);
  }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
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

.controller('regCtrl', function($rootScope, $scope, $state, $ionicPopup, RegService, Catalog) {

  try {
    if($cordovaStatusbar.isVisible()){
      $cordovaStatusbar.hide();
    }
  } catch (error) {
    console.log('hide statusBar');
    console.log(error);
  }

  $rootScope.transports = [];
  $rootScope.countries = [];

  if(window.localStorage['countries']){
    $rootScope.countries = angular.fromJson(window.localStorage['countries']);
  }else{
    Catalog.query({name: 'country'}, function(data){
      $rootScope.countries = data;
      window.localStorage['countries'] = angular.toJson(data);
    },function(error){
      console.log(error);
    });
  }

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
    });
  };
})

/*****************************************/
/******** PWD RECOVERY CONTROLLER ********/
/*****************************************/

.controller('passwordCtrl', function($scope, $state, RegService, PasswordService) {

  //initialize every time when view is called
  $scope.data = {
    sendTo: 'email',
    contact: ''
  };

  $scope.stepOne = function() {
    if(window.localStorage['token']){
      $scope.doStepOne();
    }else{
      RegService.getToken()
      .then(function(){
        $scope.doStepOne();
      });
    }
  };

  $scope.doStepOne = function() {
    PasswordService.data = $scope.data;
    PasswordService.one()
    .then(function(data) {
      $state.go('passwordTwo');
    });
  };

  $scope.stepTwo = function() {
    PasswordService.data.code = $scope.data.code;
    PasswordService.two()
    .then(function(data) {
      $state.go('regThree');
    });
  };

  $scope.stepThree= function() {
    PasswordService.data.code = $scope.data.code;
    PasswordService.two()
    .then(function(data) {
      $state.go('regThree');
    });
  };

  $scope.stepThree = function(){

  };

})

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

  $rootScope.transports = [];
  $rootScope.countries = [];

  if(window.localStorage['countries']){
    $rootScope.countries = angular.fromJson(window.localStorage['countries']);
  }else{
    Catalog.query({name: 'country'}, function(data){
      $rootScope.countries = data;
      window.localStorage['countries'] = angular.toJson(data);
    },function(error){
      console.log(error);
    });
  }

  if(window.localStorage['transports']){
    $rootScope.transports = angular.fromJson(window.localStorage['transports']);
  }else{
    Catalog.query({name: 'transport'}, function(data){
      $rootScope.transports = data;
      window.localStorage['transports'] = angular.toJson(data);
    },function(error){
      console.log(error);
    });
  }


  $scope.logout = function(){
    AuthService.logout();
  };

  $scope.exit = function() {
    ionic.Platform.exitApp();
  };

})

/*********************************/
/***** DASHBOARD CONTROLLER ******/
/*********************************/

.controller('dashboardCtrl', function($scope) {
  try {
    if(!$cordovaStatusbar.isVisible()){
      $cordovaStatusbar.show();
      $cordovaStatusbar.styleHex('#e42112');
    }
  } catch (error) {
    console.log('show statusBar');
    console.log(error);
  }
})

/*********************************/
/******** USER CONTROLLER ********/
/*********************************/

.controller('userCtrl', function($rootScope, $scope, $ionicModal, Toast, User, PasswordService) {

  $scope.user = {
    profile: null,
    password: {
      old: '',
      new: '',
      new_confirm: '',
    }
  };

  $scope.passwordResetEnabled = false;

  $scope.$watch('user.password', function(){
    if($scope.user.password.new.length > 7 && $scope.user.password.new == $scope.user.password.new_confirm){
      $scope.passwordResetEnabled = true;
    }else{
      $scope.passwordResetEnabled = false;
    }
  }, true);

  User.get({}, function(data){
    $scope.user.profile = data;
  }, function(error){
  });

  $scope.update = function(){
    User.update($scope.user.profile, function(){
      Toast.show(lngTranslate('toast_profile_updated'));
      $scope.closeModal();
    })
  };

  $scope.setPassowrd = function(){
    PasswordService.update({password: $scope.user.password.new})
    .then(function(){
      Toast.show(lngTranslate('toast_password_updated'));
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

.controller('tripsCtrl', function($scope, $state, $ionicModal, Trips, Trip, Toast, AppData) {


  Trips.get({},function(data){
    $scope.trips = data.trips;
    AppData.trips = data.trips;
  });

  $scope.doRefresh = function(){
    Trips.get({}, function(data){
      $scope.trips = data.trips;
      AppData.trips = data.trips;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error){
      $scope.$broadcast('scroll.refreshComplete');
    });
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
    $scope.trip = {id: 'add', time_start: 61200, time_end: 61200};
    $scope.openModal();
  };

  $scope.create = function(){
    Trip.add($scope.trip.data, function(data){
      $scope.closeModal();
      Toast.show(lngTranslate('toast_trip_created'));
      $state.go('main.trip.data', {id: data.id});
    });
  };

})

/****************************************/
/******** SINGLE TRIP CONTROLLER ********/
/****************************************/

.controller('tripCtrl', function($scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Trip, Check, Toast) {

  Trip.get({id: $stateParams.id},function(data){
    $scope.trip = data;
  });

  $ionicModal.fromTemplateUrl('templates/trips/edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalTrip = modal;
  });

  $ionicModal.fromTemplateUrl('templates/trips/add-check.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCheck = modal;
  });

  $scope.editTrip = function(){
    $scope.modalTrip.show();
  };

  $scope.addCheck = function(){
    $scope.check = {id: 'add', trip: $stateParams.id, files: []};
    $scope.modalCheck.show();
  };

  $scope.closeModal = function() {
    $scope.modalTrip.hide();
    $scope.modalCheck.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modalTrip.remove();
    $scope.modalCheck.remove();
  });

  $scope.update = function(){
    Trip.update($scope.trip, function(){
      Toast.show(lngTranslate('toast_trip_updated'));
      $scope.closeModal();
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
        });
      }
    });
  };

  $scope.createCheck = function(){
    Check.add($scope.check, function(){
      Toast.show(lngTranslate('toast_check_created'));
    },function(error){
      Toast.show(error);
    });
  };

})

/***************************************/
/******** CHECK LIST CONTROLLER ********/
/***************************************/

.controller('checksCtrl', function($rootScope, $scope, $ionicModal, Checks, Check, Trip, Trips, Toast, AppData) {

  var scrollRefresh = false;

  window.SpinnerPlugin.activityStart(lngTranslate('loading'));
  Checks.get({},function(data){
    $scope.checks = data.checks;
    $scope.complete($scope.checks);
  });

  $scope.doRefresh = function(){
    Checks.get({}, function(data){
      $scope.checks = data.checks;
      $scope.complete();
    }, function(error){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  if(AppData.trips.length == 0){
    Trips.get({},function(data){
      AppData.trips = data.trips;
    });
  }

  var getCountryName = function(){
    angular.forEach($scope.checks, function(check, i){
      angular.forEach(AppData.trips, function(trip, j){
        if(trip.id == check.trip){
          $scope.checks[i].country_enter = $rootScope.getById($rootScope.countries,trip.country_enter).name;
          $scope.checks[i].country_leaving = $rootScope.getById($rootScope.countries,trip.country_leaving).name;
        }
      });
    });
    $scope.$broadcast('scroll.refreshComplete');
    window.SpinnerPlugin.activityStop();
  };

  $scope.complete = function(){
    if(AppData.trips.length == 0){
      Trips.get({},function(data){
        AppData.trips = data.trips;
        getCountryName();
      });
    }else{
      getCountryName();
    }
  };

  Trips.get({},function(data){
    $scope.trips = data.trips;
  });

  $ionicModal.fromTemplateUrl('templates/checks/add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCheck = modal;
  });

  $scope.addCheck = function(){
    $scope.check = {id: 'add', files: []};
    $scope.modalCheck.show();
  };

  $scope.closeModal = function() {
    $scope.modalCheck.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modalCheck.remove();
  });

  $scope.createCheck = function(){
    Check.add($scope.check, function(){
      Toast.show(lngTranslate('toast_check_created'));
    },function(error){
      Toast.show(error);
    });
  };


})

/*****************************************/
/******** SINGLE CHECK CONTROLLER ********/
/*****************************************/

.controller('checkCtrl', function($rootScope, $scope, $stateParams, $ionicModal, $cordovaDialogs, Check, Toast, Trips, AppData) {

  window.SpinnerPlugin.activityStart(lngTranslate('loading'));
  Check.get({id: $stateParams.id}, function(data){
    $scope.check = data;
    $scope.check.images = []; //for new images
    $scope.complete();
  });

  var getCountryName = function(){
    angular.forEach(AppData.trips, function(trip){
      if(trip.id == $scope.check.trip){
        $scope.check.country_enter = $rootScope.getById($rootScope.countries,trip.country_enter).name;
        $scope.check.country_leaving = $rootScope.getById($rootScope.countries,trip.country_leaving).name;
      }
    });
    $scope.$broadcast('scroll.refreshComplete');
    window.SpinnerPlugin.activityStop();
  };

  $scope.complete = function(){
    if(AppData.trips.length == 0){
      Trips.get({},function(data){
        AppData.trips = data.trips;
        getCountryName();
      });
    }else{
      getCountryName();
    }
  };

  $scope.deletePhoto = function(index){
    $scope.check.files.splice(index,1);
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
    for (var i = 0; i < $scope.check.images.length; i++){
      $scope.check.files.push($scope.check.images[i]);
    }
    Check.update({id: $scope.check.id}, $scope.check, function(){
      Toast.show(lngTranslate('toast_check_updated'));
    });
  };

  $scope.delete = function(){
    $cordovaDialogs.confirm(
      lngTranslate('dialog_remove_check_message'),
      lngTranslate('dialog_remove_check_title'),
      [lngTranslate('yes'),lngTranslate('no')])
    .then(function(buttonIndex) {
      if(buttonIndex == 1){
        Check.delete($scope.check.id, function(){
          Toast.show(lngTranslate('toast_check_deleted'));
          $state.go('main.checks');
        });
      }
    });
  };

})

/*********************************************/
/******** DECLARATION LIST CONTROLLER ********/
/*********************************************/

.controller('declarationsCtrl', function($scope, $ionicModal, Declarations) {

  window.SpinnerPlugin.activityStart(lngTranslate('loading'));

  Declarations.query({},function(data){
    $scope.declarations = data;
    window.SpinnerPlugin.activityStop();
  },function(error){
    window.SpinnerPlugin.activityStop();
  });

  $scope.doRefresh = function(){
    Declarations.query({},function(data){
      $scope.$broadcast('scroll.refreshComplete');
      $scope.declarations = data;
    },function(error){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

})

/***********************************************/
/******** SINGLE DECLARATION CONTROLLER ********/
/***********************************************/

.controller('declarationCtrl', function($scope, $stateParams, $ionicModal, Declaration, DeclarationService) {
  Declaration.get({id: $stateParams.id},function(data){
    $scope.declaration = data;
  });

  $scope.doRefresh = function(){
    Declaration.get({id: $stateParams.id},function(data){
      $scope.$broadcast('scroll.refreshComplete');
      $scope.declaration = data;
    },function(error){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.deliveryMethod = function(method){
    //save method DeclarationService
    Toast.show('success');
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

.controller('settingsCtrl', function($rootScope, $scope, $state, $ionicPopup, $cordovaDialogs, Toast) {

  try {
    if(!$cordovaStatusbar.isVisible()){
      $cordovaStatusbar.show();
      $cordovaStatusbar.styleHex('#e42112');
    }
  } catch (error) {
    console.log('show statusBar');
    console.log(error);
  }

  $scope.settings = {
    language: window.localStorage['lang']
  };

  $scope.language = window.localStorage['lang'];

  $scope.save = function(){
    window.localStorage['lang'] = $scope.settings.language;
    window.location.reload(true);
  };

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