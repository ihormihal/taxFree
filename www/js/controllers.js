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

  window.localStorage['ready'] = true;

  $scope.user = {};

  if(AuthService.credentials.username){
    $scope.user.username = AuthService.credentials.username;
  }
  if(AuthService.credentials.password){
    $scope.user.password = AuthService.credentials.password;
  }

  $scope.login = function() {
    AuthService.credentials.username = $scope.user.username;
    AuthService.credentials.password = $scope.user.password;
    AuthService.login();
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
      AuthService.credentials.username = RegService.data.email;
      AuthService.credentials.password = RegService.data.password;
      $state.go('login');
    });
  };

})

/*****************************************/
/******** PWD RECOVERY CONTROLLER ********/
/*****************************************/

.controller('passwordCtrl', function($scope, $state, Alert, RegService, PasswordService, AuthService, Toast) {

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
      $state.go('passwordTwo');
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
      AuthService.credentials.password = PasswordService.data.password;
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


})

/*********************************/
/***** DASHBOARD CONTROLLER ******/
/*********************************/

.controller('dashboardCtrl', function($scope, Dashboard, DashboardAction, DashboardNoaction) {

  $scope.itemActive = 0;

  $scope.toggleItem = function(index){
    if($scope.itemActive == index){
      $scope.itemActive = null;
    }else{
      $scope.itemActive = index;
    }
  }


  $scope.load = function(){
    DashboardAction.get({request: 'list'}, function(data){
      $scope.actionlist = data;
    });
    Dashboard.get({request: 'allpayments'}, function(data){
      $scope.allpayments = data;
    });
    Dashboard.get({request: 'lastapprovedpayment'}, function(data){
      $scope.lastapprovedpayment = data;
    });
    DashboardNoaction.get({request: 'list'}, function(data){
      $scope.noactionlist = data;
    });
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.load();


})

/*********************************/
/******** USER CONTROLLER ********/
/*********************************/

.controller('userCtrl', function($rootScope, $scope, $ionicModal, Toast, User) {

  $scope.user = {
    profile: null,
    images: [],
    params: {}
  };

  $scope.load = function(){
    User.get({}, function(data){
      $scope.user.profile = data;
      $scope.user.params = {userid: $scope.user.profile.id};
      $scope.user.images[0] = {src: $scope.user.profile.passport, progress: 100, error: false};
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.load();

  $scope.update = function(){
    $scope.user.profile.passport = $scope.user.images[0].src;
    User.update($scope.user.profile, function(){
      Toast.show(lngTranslate('toast_profile_updated'));
      $scope.closeModal();
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

  $scope.load = function(){
    Trips.query({},function(data){
      $scope.trips = data;
      if($scope.trips.length == 0){
        Toast.show(lngTranslate('no_data'));
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.load();

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
.controller('tripCtrl', function($scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Trip, TripChecks, TripDeclarations, Check, Toast) {

  $scope.check = {id: 'add', trip: $stateParams.id, files: [], images: []};

  $scope.load = function(){
    Trip.get({id: $stateParams.id},function(data){
      $scope.trip = data;
      $scope.loadChecks();
      $scope.loadDeclarations();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.load();

  $scope.loadChecks = function(){
    if($scope.trip.checks.length == 0){
      if($state.current.name == 'main.trip.checks'){
        Toast.show(lngTranslate('no_data'));
      }
    }else{
      TripChecks.query({id: $stateParams.id},function(data){
        $scope.checks = data;
      });
    }
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadDeclarations = function(){
    if($scope.trip.declarations.length == 0){
      if($state.current.name == 'main.trip.declarations'){
        Toast.show(lngTranslate('no_data'));
      }
    }else{
      TripDeclarations.query({id: $stateParams.id},function(data){
        $scope.declarations = data;
      });
    }
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
    angular.forEach($scope.check.images, function(image){
      $scope.check.files.push(image.src);
    });
    $scope.check.images = [];
    Check.add($scope.check, function(data){
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

.controller('checksCtrl', function($rootScope, $scope, $state, $ionicModal, Checks, Check, Trip, Trips, Toast) {
  $scope.checks = [];
  $scope.check = {id: 'add', trip: '', files: [], images: []};

  $scope.load = function(){
    Checks.get({},function(data){
      $scope.checks = data.checks;
      if($scope.checks.length == 0){
        Toast.show(lngTranslate('no_data'));
        $scope.$broadcast('scroll.refreshComplete');
      }
      Trips.query({},function(data){
        $scope.trips = data;
        $scope.complete();
      });
    });
  };

  $scope.load();

  $scope.complete = function(){
    $scope.$broadcast('scroll.refreshComplete');
    angular.forEach($scope.checks, function(check, i){
      angular.forEach($scope.trips, function(trip){
        if(trip.id == check.trip){
          $scope.checks[i].country_enter = $rootScope.getById($rootScope.countries,trip.country_enter).name;
          $scope.checks[i].country_leaving = $rootScope.getById($rootScope.countries,trip.country_leaving).name;
        }
      });
    });
  };

  $ionicModal.fromTemplateUrl('templates/checks/add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCheck = modal;
  });

  $scope.addCheck = function(){
    $scope.modalCheck.show();
  };

  $scope.closeModal = function() {
    $scope.modalCheck.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modalCheck.remove();
  });

  $scope.create = function(){
    angular.forEach($scope.check.images, function(image){
      $scope.check.files.push(image.src);
    });
    $scope.check.images = [];
    Check.add($scope.check, function(data){
      Toast.show(lngTranslate('toast_check_created'));
      $state.go('main.check', {id: data.id});
    });
  };


})

/*****************************************/
/******** SINGLE CHECK CONTROLLER ********/
/*****************************************/

.controller('checkCtrl', function($rootScope, $scope, $stateParams, $ionicModal, $cordovaDialogs, Check, Toast, Trips) {
  window.SpinnerPlugin.activityStart(lngTranslate('loading'));
  Check.get({id: $stateParams.id}, function(data){
    $scope.check = data;
    $scope.check.images = []; //for new images
    $scope.complete();
  });

  var getCountryName = function(){
    angular.forEach($scope.trips, function(trip){
      if(trip.id == $scope.check.trip){
        $scope.check.country_enter = $rootScope.getById($rootScope.countries,trip.country_enter).name;
        $scope.check.country_leaving = $rootScope.getById($rootScope.countries,trip.country_leaving).name;
      }
    });
    $scope.$broadcast('scroll.refreshComplete');
    window.SpinnerPlugin.activityStop();
  };

  $scope.complete = function(){
    Trips.query({},function(data){
      $scope.trips = data;
      getCountryName();
    });
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
    angular.forEach($scope.check.images, function(image){
      $scope.check.files.push(image.src);
    });
    $scope.check.images = [];
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

.controller('declarationsCtrl', function($scope, Declarations, Toast) {

  $scope.load = function(){
    Declarations.query({},function(data){
      $scope.declarations = data;
      if($scope.declarations.length == 0){
        Toast.show(lngTranslate('no_data'));
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.load();

})

/***********************************************/
/******** SINGLE DECLARATION CONTROLLER ********/
/***********************************************/

.controller('declarationCtrl', function($scope, $stateParams, $cordovaFileTransfer, Declaration, Toast) {

  $scope.file = {
    exist: false,
    name: null,
    path: null
  };

  $scope.load = function(){
    Declaration.get({id: $stateParams.id},function(data){
      $scope.$broadcast('scroll.refreshComplete');
      $scope.declaration = data;

      //$scope.declaration.file = $scope.declaration.file.replace('app_dev.php/','');
      //$scope.declaration.file = 'http://mycode.in.ua/app/Declaration_GB.pdf'; //for test

      var fileDirectoty = '';

      $scope.file.name = $scope.declaration.file.split("/").pop();
      try {
        if(ionic.Platform.isIOS()){
          fileDirectoty = cordova.file.documentsDirectory;
          /* file /var/mobile/Containers/Data/Application/<UUID>/Documents/ */
        }else{
          fileDirectoty = cordova.file.externalDataDirectory;
          /* Android/data/<app-id>/files */
        }
      } catch (error) {
        console.log(error);
      }

      $scope.file.path = fileDirectoty + $scope.file.name;

      //Check for the downloaded file.
      try {
        window.resolveLocalFileSystemURL($scope.file.path,function(){
          $scope.file.exist = true;
        });
      } catch (error) {
        console.log(error);
      }

    });

  };
  $scope.load();

  $scope.deliveryMethod = function(method){
    Declaration.update({id: $stateParams.id, type: method}, function(data){
      Toast.show(lngTranslate('delivery_method_success')+': ' + lngTranslate(method));
      $scope.doRefresh();
    });
  };

  $scope.download = function() {

    var options = {
      headers: {'Authorization': window.localStorage['token']}
    };

    $cordovaFileTransfer.download($scope.declaration.file, $scope.file.path, options, true)
    .then(function (result) {
      Toast.show(lngTranslate('download_success'));
      $scope.file.exist = true;
      $scope.$apply();
    }, function (error) {
      Toast.show(lngTranslate('download_error') + ' ' + angular.toJson(error));
    }, function (progress) {
      // PROGRESS HANDLING GOES HERE
    });

  };

  $scope.openfile = function(){
    cordova.plugins.disusered.open($scope.file.path, function(){
      //success
    }, function(){
      if (code === 1) {
        Toast.show(lngTranslate('open_file_error'));
      } else {
        Toast.show(lngTranslate('undefined_error'));
      }
    });
  };

})

/*****************************************/
/********** CARD LIST CONTROLLER *********/
/*****************************************/

.controller('cardsCtrl', function($scope, $state, $ionicModal, Cards, Card, Toast){

  $scope.valid = {
    number: false,
    date: false
  };

  $scope.card = {id: 'add', is_default: 0};

  $scope.load = function(){
    Cards.query({},function(data){
      $scope.cards = data;
      if($scope.cards.length == 0){
        Toast.show(lngTranslate('no_data'));
      }
      for(var i = 0; i < $scope.cards.length; i++){
        $scope.cards[i].num = '**** **** **** '+$scope.cards[i].number.substr(7,4);
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.load();

  $scope.$watch('card', function(){

    if($scope.card.number){
      if($scope.card.number.toString().length == 16){
        $scope.valid.number = true;
      }else{
        $scope.valid.number = false;
      }
    }

    var now = new Date();
    if($scope.card.expire_date < now){
      $scope.valid.date = false;
    }else{
      $scope.valid.date = true;
    }


  }, true);

  $ionicModal.fromTemplateUrl('templates/cards/add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.add = function(){
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.create = function(){
    $scope.card.expire_month = $scope.card.expire_date.getMonth() + 1;
    $scope.card.expire_year = $scope.card.expire_date.getFullYear();
    Card.add($scope.card, function(data){
      $scope.modal.hide();
      Toast.show(lngTranslate('toast_card_added'));
      $state.go('main.card', {id: data.id});
    });
  };

})


/*****************************************/
/********** CARD ITEM CONTROLLER *********/
/*****************************************/

.controller('cardCtrl', function($rootScope, $scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Card, Toast) {

  $scope.valid = {
    number: false,
    date: false
  };

  $scope.card = null;

  $scope.load = function(){
    Card.get({id: $stateParams.id}, function(data){
      $scope.card = data;
      $scope.card.expire_date = new Date($scope.card.expire_year,$scope.card.expire_month-1,1);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.load();

  $scope.doRefresh = function(){
    $scope.load();
  };

  $scope.$watch('card', function(){

    if($scope.card){
      if($scope.card.number.toString().length == 16){
        $scope.valid.number = true;
      }else{
        $scope.valid.number = false;
      }


      var now = new Date();
      if($scope.card.expire_date < now){
        $scope.valid.date = false;
      }else{
        $scope.valid.date = true;
      }
    }


  }, true);

  $ionicModal.fromTemplateUrl('templates/cards/edit.html', {
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

  $scope.delete = function(){
    $cordovaDialogs.confirm(
      lngTranslate('dialog_remove_card_message'),
      lngTranslate('dialog_remove_card_title'),
      [lngTranslate('yes'),lngTranslate('no')])
    .then(function(buttonIndex) {
      if(buttonIndex == 1){
        Card.delete({id: $scope.card.id}, function(){
          Toast.show(lngTranslate('toast_card_deleted'));
          $state.go('main.cards');
        });
      }
    });
  };

  $scope.update = function(){
    $scope.card.expire_month = $scope.card.expire_date.getMonth() + 1;
    $scope.card.expire_year = $scope.card.expire_date.getFullYear();
    Card.update({id: $scope.card.id}, $scope.card, function(){
      $scope.modal.hide();
      Toast.show(lngTranslate('toast_card_updated'));
    });
  };

})

/**************************************/
/******** ABOUT PAGE CONTROLLER *******/
/**************************************/

.controller('aboutCtrl', function($scope) {

})

/**************************************/
/******** FAQ PAGE CONTROLLER *********/
/**************************************/

.controller('faqCtrl', function($scope) {
  $scope.itemActive = null;
  $scope.toggleItem = function(index){
    if($scope.itemActive == index){
      $scope.itemActive = null;
    }else{
      $scope.itemActive = index;
    }
  }
  $scope.faq = content.faq;
})

/**************************************/
/******** TERMS PAGE CONTROLLER *******/
/**************************************/

.controller('termsCtrl', function($scope) {

})

/*****************************************/
/******** SETTINGS APP CONTROLLER ********/
/*****************************************/

.controller('settingsCtrl', function($rootScope, $scope, $state, $ionicPopup, $cordovaDialogs, Toast, AuthService) {

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
        AuthService.credentials.username = null;
        AuthService.credentials.password = null;
        AuthService.credentials.refresh_token = null;
        AuthService.logout();
        $state.go('start');
      }
    });

  };
})

;