angular.module('app.controller.auth', [])

/*** LOGIN ***/
.controller('loginCtrl', function($rootScope, $scope, $state, $ionicModal, $http, $cordovaDialogs, $cordovaFile, AuthService) {

	window.localStorage['ready'] = true;
	$scope.user = {};

	if (AuthService.credentials.username) {
		$scope.user.username = AuthService.credentials.username;
	}
	if (AuthService.credentials.password) {
		$scope.user.password = AuthService.credentials.password;
	}

	$scope.login = function() {
		AuthService.credentials.username = $scope.user.username;
		AuthService.credentials.password = $scope.user.password;
		AuthService.login();
	};

	//DEVELOPER MODE
	$scope.dev = {
		domain: $rootScope.config.domain,
	};

	$ionicModal.fromTemplateUrl('views/public/settings_dev.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalDev = modal;
	});
	$scope.$on('$destroy', function() {
		$scope.modalDev.remove();
	});

	var dev_clicked = 0;
	$scope.activateDeveloperMode = function(){
		dev_clicked += 1;
		if(dev_clicked > 12){
			$scope.modalDev.show();
		}
	};

	$scope.closeModalDev = function(){
		$scope.modalDev.hide();
		dev_clicked = 0;
	};

	$scope.clearCache = function() {

		$cordovaDialogs.confirm(
		lngTranslate('dialog_clear_cache_message'),
		lngTranslate('dialog_clear_cache_title'), [lngTranslate('yes'), lngTranslate('no')])
		.then(function(buttonIndex) {
			if (buttonIndex == 1) {
				try {
					$cordovaFile.removeRecursively(cordova.file.cacheDirectory, "");
				} catch (error) {
					console.log(error);
				}
				$state.go('start');
				window.localStorage.clear();
				window.location.reload(true);
			}
		});

	};

	$scope.submitDeviceToken = function(){
		var platform = null;
		if(ionic.Platform.isAndroid()) platform = 'google';
		if(ionic.Platform.isIOS()) platform = 'apple';

		$http({
			method: 'GET',
			url: 'http://mycode.in.ua/app/save_push.php?platform='+platform+'token='+window.localStorage['deviceToken']
		}).then(function(){
			Toast.show('You device token: ' + window.localStorage['deviceToken']);
		});

	};

	$scope.saveDev = function(){
		if($scope.dev.domain !== $rootScope.config.domain){
			$rootScope.config.domain = $scope.dev.domain;
			window.localStorage['config'] = angular.toJson($rootScope.config);
			window.location.reload(true);
		}
		$scope.closeModalDev();
		//window.location.reload(true);
	};

})

/*** REGISTRAION ***/
.controller('regCtrl', function($rootScope, $scope, $state, $ionicModal, AuthService, RegService, Catalog, Toast) {

	$scope.images = [];

	$scope.data = RegService.data;
	
	$scope.data.country = 2;

	window.localStorage['token'] = '';
	$rootScope.countries = [];

	window.SpinnerPlugin.activityStart(lngTranslate('loading'));
	var loadCountries = function() {
		if (window.localStorage['countries']) {
			$rootScope.countries = angular.fromJson(window.localStorage['countries']);
		}
		else {
			Catalog.query({
				name: 'country'
			}, function(data) {
				window.SpinnerPlugin.activityStop();
				$rootScope.countries = data;
				window.localStorage['countries'] = angular.toJson(data);
			});
		}
	};

	RegService.getToken()
		.then(function() {
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

	$scope.stepThree = function() {
		RegService.data.password = $scope.data.password;
		RegService.data.before_fs = $scope.data.before_fs;
		RegService.data.fs_name = $scope.data.fsname;
		RegService.data.country = $scope.data.country;
		RegService.data.address = $scope.data.address;
		var ready = true;
		if($scope.images.length){
			if ($scope.images[0].progress == 100) {
				RegService.data.passport = $scope.images[0].src;
			} else {
				ready = false;
			}
		}
		if(ready){
			RegService.three()
			.then(function(data) {
				Toast.show(lngTranslate('registration_success'));
				AuthService.credentials.user = data.user; //regisered user
				AuthService.credentials.username = RegService.data.email;
				AuthService.credentials.password = RegService.data.password;
				$state.go('login');
			});
		}else{
			Toast.show(lngTranslate('please_wait_uploading'));
		}
	};

	$ionicModal.fromTemplateUrl('views/public/terms.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal_terms = modal;
	});

	$scope.$on('$destroy', function() {
		$scope.modal_terms.remove();
	});

	$scope.openTerms = function(){
		$scope.modal_terms.show();
	};
	$scope.closeTerms = function(){
		$scope.modal_terms.hide();
	};
})


/*** PASSWORD RECOVERY CONTROLLER ***/
.controller('passwordCtrl', function($scope, $state, Alert, RegService, PasswordService, AuthService, Toast) {

	$scope.data = PasswordService.data;

	$scope.stepOne = function() {
		if (window.localStorage['token']) {
			$scope.doStepOne();
		} else {
			RegService.getToken()
				.then(function() {
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

});