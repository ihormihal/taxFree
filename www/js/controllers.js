angular.module('app.controllers', [])

/****************************************/
/*********** START CONTROLLER ***********/
/****************************************/

.controller('startCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
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

.controller('loginCtrl', function($scope, $state, $ionicPopup, Toast, AuthService) {

  $scope.user = {
    username: '',
    password: ''
  };

  if(AuthService.data.email){
    $scope.user.username = AuthService.data.email;
  }
  if(AuthService.data.password){
    $scope.user.password = AuthService.data.password;
  }

  $scope.login = function() {
    AuthService.login($scope.user);
  };

})

/********************************/
/******** REG CONTROLLER ********/
/********************************/

.controller('regCtrl', function($rootScope, $scope, $state, $ionicPopup, AuthService, RegService, Catalog, Toast) {

  //initialize every time when view is called
  $scope.data = RegService.data;

  window.localStorage['token'] = '';
  $rootScope.transports = [];
  $rootScope.countries = [];

  var loadCountries = function(){
    if(window.localStorage['countries']){
      $rootScope.countries = angular.fromJson(window.localStorage['countries']);
    }else{
      Catalog.query({name: 'country'}, function(data){
        $rootScope.countries = data;
        window.localStorage['countries'] = angular.toJson(data);
      });
    }
  };

  RegService.getToken()
  .then(function(){
    loadCountries();
  });

  $scope.stepOne = function() {
    RegService.data.country = $scope.data.country;
    RegService.data.phone = $scope.data.phone;
    RegService.data.email = $scope.data.email;
    RegService.one()
    .then(function(data) {
      RegService.data.user = data.user;
      $state.go('regTwo');
    });
  };

  $scope.stepTwo = function() {
    RegService.data.code = $scope.data.code;
    console.log(RegService.data);
    RegService.two()
    .then(function(data) {
      $state.go('regThree');
    });
  };

  $scope.stepThree = function(){
    RegService.data.password = $scope.data.password;
    RegService.data.before_fs = $scope.data.before_fs;
    RegService.data.fs_name = $scope.data.fsname;
    RegService.data.country = $scope.data.country;
    RegService.data.address = $scope.data.address;
    RegService.three()
    .then(function(data) {
      Toast.show(lngTranslate('registration_success'));
      AuthService.data = {email: RegService.data.email, password: RegService.data.password};
      $state.go('login');
    });
  };

})

/*****************************************/
/******** PWD RECOVERY CONTROLLER ********/
/*****************************************/

.controller('passwordCtrl', function($scope, $state, Alert, RegService, PasswordService, Toast) {

  //initialize every time when view is called
  $scope.data = PasswordService.data;

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
    PasswordService.data.contact = $scope.data.contact;
    PasswordService.data.sendTo = $scope.data.sendTo;
    PasswordService.one()
    .then(function(data) {
      if($scope.data.sendTo == 'email'){
        Alert.show({message: lngTranslate('password_email_message'), title: lngTranslate('password_email_title')});
      }else{
        $state.go('passwordTwo');
      }
    });
  };

  $scope.stepTwo = function() {
    PasswordService.data.code = $scope.data.code;
    PasswordService.two()
    .then(function(data) {
      PasswordService.data.token = data.token;
      $state.go('passwordThree');
    });
  };

  $scope.stepThree = function() {
    PasswordService.data.password = $scope.data.password;
    PasswordService.three()
    .then(function(data) {
      Toast.show(lngTranslate('password_restore_success'));
      $state.go('login');
    });
  };

})

/****************************************/
/******** PRIVATE APP CONTROLLER ********/
/****************************************/

.controller('AppCtrl', function($ionicPlatform, $rootScope, $scope, $state, AuthService, Catalog) {


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
    $ionicPlatform.exitApp();
  };

})

/*********************************/
/***** DASHBOARD CONTROLLER ******/
/*********************************/

.controller('dashboardCtrl', function($scope, Dashboard) {

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };


  $scope.load = function(){
    Dashboard.get({request: 'action/list'}, function(data){
      $scope.actionlist = data;
    });
    Dashboard.get({request: 'allpayments'}, function(data){
      $scope.allpayments = data;
    });
    Dashboard.get({request: 'lastapprovedpayment'}, function(data){
      $scope.lastapprovedpayment = data;
    });
    Dashboard.get({request: 'noaction/list'}, function(data){
      $scope.noactionlist = data;
    });
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.load();

  $scope.doRefresh = function(){
    $scope.load();
  };


})

/*********************************/
/******** USER CONTROLLER ********/
/*********************************/

.controller('userCtrl', function($rootScope, $scope, $ionicModal, Toast, User, PasswordService) {

  $scope.user = {
    profile: null,
    password: '',
    password_confirm: ''
  };

  User.get({}, function(data){
    $scope.user.profile = data;
  });

  $scope.update = function(){
    User.update($scope.user.profile, function(){
      Toast.show(lngTranslate('toast_profile_updated'));
      $scope.closeModal();
    })
  };

  $scope.setPassowrd = function(){
    PasswordService.update({password: $scope.user.password})
    .then(function(){
      Toast.show(lngTranslate('toast_password_updated'));
      $scope.user.password = '';
      $scope.user.password_confirm = '';
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

  $scope.formDisabled = true;
  $scope.$watch('user', function(){
    if($scope.user.password && $scope.user.password_confirm){
      if($scope.user.password == $scope.user.password_confirm && $scope.user.password.length > 7){
        $scope.formDisabled = false;
      }else{
        $scope.formDisabled = true;
      }
    }else{
      $scope.formDisabled = true;
    }
  }, true);

})

/***************************************/
/******** TRIP LIST CONTROLLER ********/
/***************************************/

.controller('tripsCtrl', function($scope, $state, $ionicModal, Trips, Trip, Toast, AppData) {

  $scope.load = function(){
    try {
      Trips.get({},function(data){
        $scope.trips = data.trips;
        AppData.trips = data.trips;
        if($scope.trips.length == 0){
          Toast.show(lngTranslate('no_data'));
        }
        $scope.$broadcast('scroll.refreshComplete');
      });
    } catch (error) {
      Toast.show(lngTranslate('no_data'));
      $scope.$broadcast('scroll.refreshComplete');
    }
  };

  $scope.load();

  $scope.doRefresh = function(){
    $scope.load();
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
    $scope.trip = {id: 'add'};
    $scope.openModal();
  };

  $scope.create = function(){
    Trip.add($scope.trip, function(data){
      $scope.closeModal();
      Toast.show(lngTranslate('toast_trip_created'));
      $state.go('main.trip.data', {id: data.id});
    });
  };

  $scope.$watch('trip.date_start', function(){
    if(!$scope.trip) return false;
    if($scope.trip.date_end < $scope.trip.date_start){
      $scope.trip.date_end = $scope.trip.date_start;
    }
  });

  $scope.$watch('trip.date_end', function(){
    if(!$scope.trip) return false;
    if($scope.trip.date_end < $scope.trip.date_start){
      $scope.trip.date_start = $scope.trip.date_end;
    }
  });

})

/****************************************/
/******** SINGLE TRIP CONTROLLER ********/
/****************************************/
.controller('tripCtrl', function($scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Trip, Check, Toast) {

  Trip.get({id: $stateParams.id},function(data){
    $scope.trip = data;
  });

  $scope.doRefresh = function(){
    Trip.get({id: $stateParams.id},function(data){
      $scope.trip = data;
    });
    $scope.$broadcast('scroll.refreshComplete');
  };

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
    var check = {id: 'add', trip: $scope.check.trip, files: []};
    for(var i = 0; i < $scope.check.files.length; i++){
      check.files.push($scope.check.files[i].src);
    }
    Check.add(check, function(data){
      Toast.show(lngTranslate('toast_check_created'));
      $state.go('main.check', {id: data.id});
    },function(error){
      Toast.show(error);
    });
  };

  $scope.$watch('trip.date_start', function(){
    if(!$scope.trip) return false;
    if($scope.trip.date_end < $scope.trip.date_start){
      $scope.trip.date_end = $scope.trip.date_start;
    }
  });

  $scope.$watch('trip.date_end', function(){
    if(!$scope.trip) return false;
    if($scope.trip.date_end < $scope.trip.date_start){
      $scope.trip.date_start = $scope.trip.date_end;
    }
  });

})

/***************************************/
/******** CHECK LIST CONTROLLER ********/
/***************************************/

.controller('checksCtrl', function($rootScope, $scope, $state, $ionicModal, Checks, Check, Trip, Trips, Toast, AppData) {

  var scrollRefresh = false;

  $scope.checks = [];
  $scope.load = function(){
    Checks.get({},function(data){
      if(data.checks){
        $scope.checks = data.checks;
      }
      if($scope.checks.length == 0){
        Toast.show(lngTranslate('no_data'));
      }else{
        $scope.complete($scope.checks);
      }
    });
  };

  $scope.load();

  $scope.doRefresh = function(){
    $scope.load();
  };

  var getCountryName = function(){
    $scope.$broadcast('scroll.refreshComplete');
    angular.forEach($scope.checks, function(check, i){
      angular.forEach(AppData.trips, function(trip){
        if(trip.id == check.trip){
          $scope.checks[i].country_enter = $rootScope.getById($rootScope.countries,trip.country_enter).name;
          $scope.checks[i].country_leaving = $rootScope.getById($rootScope.countries,trip.country_leaving).name;
        }
      });
    });
  };

  $scope.complete = function(){
    if(AppData.trips.length == 0){
      Trips.get({},function(data){
        AppData.trips = data.trips;
        $scope.trips = data.trips;
        getCountryName();
      });
    }else{
      $scope.trips = AppData.trips;
      getCountryName();
    }
  };

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

  $scope.create = function(){
    var check = {id: 'add', trip: $scope.check.trip, files: []};
    for(var i = 0; i < $scope.check.files.length; i++){
      check.files.push($scope.check.files[i].src);
    }
    Check.add(check, function(data){
      Toast.show(lngTranslate('toast_check_created'));
      $state.go('main.check', {id: data.id});
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
      console.log('get_trips');
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

.controller('declarationsCtrl', function($scope, $ionicModal, Declarations, Toast) {

  $scope.load = function(){
    Declarations.get({},function(data){
      $scope.declarations = data.declarations;
      if($scope.declarations.length == 0){
        Toast.show(lngTranslate('no_data'));
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.load();

  $scope.doRefresh = function(){
    $scope.load();
  };

})

/***********************************************/
/******** SINGLE DECLARATION CONTROLLER ********/
/***********************************************/

.controller('declarationCtrl', function($scope, $stateParams, $ionicModal, Declaration, DeclarationService, Toast) {
  Declaration.get({id: $stateParams.id},function(data){
    $scope.declaration = data;
  });

  $scope.deliverySelected = false;

  $scope.doRefresh = function(){
    Declaration.get({id: $stateParams.id},function(data){
      $scope.$broadcast('scroll.refreshComplete');
      $scope.declaration = data;
    });
  };

  $scope.deliveryMethod = function(method){
    Declaration.update({id: $stateParams.id, type: method}, function(data){
      Toast.show(lngTranslate('delivery_method_success')+': ' + lngTranslate(method));
      $scope.doRefresh();
    });
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