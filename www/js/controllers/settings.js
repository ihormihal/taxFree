
angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $http, $scope, $state, $ionicModal, $cordovaDialogs, $cordovaFile, Settings, AuthService, Toast) {

	$scope.appSettings = {
		language: window.localStorage['lang']
	};


	$scope.load = function(){
		$rootScope.loading = true;
		Settings.get({}, function(data){
			$scope.settings = data;
			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	$scope.load();

	$scope.save = function() {
		if(window.localStorage['lang'] !== $scope.appSettings.language){
			window.localStorage['lang'] = $scope.appSettings.language;
			window.location.reload(true);
		}
		Settings.update({settings: angular.toJson($scope.settings)}, function(data){
			Toast.show(lngTranslate('settings_saved'));
		});
	};

	//DEVELOPER MODE
	$scope.dev = {
		domain: $rootScope.config.domain,
	};

	$ionicModal.fromTemplateUrl('views/private/settings_dev.html', {
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
		if(dev_clicked > 5){
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
				AuthService.logout();
				window.localStorage.clear();
				window.location.reload(true);
			}
		});

	};

	$scope.submitDeviceToken = function(){
		$http({
			method: 'GET',
			url: 'http://mycode.in.ua/app/save_push.php?token='+window.localStorage['deviceToken']
		}).then(function(){
			Toast.show('You device token: ' + window.localStorage['deviceToken']);
		});

		var platform = null;
		if(ionic.Platform.isAndroid()) platform = 'google';
		if(ionic.Platform.isIOS()) platform = 'apple';
		if(window.localStorage['deviceToken'] && platform){

			Settings.sendDeviceToken({
				identifier: window.localStorage['deviceToken'],
				type: platform
			});
		}

	};

	$scope.saveDev = function(){;
		if($scope.dev.domain !== $rootScope.config.domain){
			$rootScope.config.domain = $scope.dev.domain;
			window.localStorage['config'] = angular.toJson($rootScope.config);
			AuthService.logout();
			window.location.reload(true);
		}
		$scope.closeModalDev();
		//window.location.reload(true);
	};


});