angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $http, $scope, $state, $ionicPopup, $cordovaDialogs, $cordovaPush, Settings, AuthService, Alert, Toast) {

	$scope.appSettings = {
		language: window.localStorage['lang']
	};


	Settings.get({}, function(data){
		$scope.settings = data;
	});


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

	$scope.developerMode = false;
	var dev_clicked = 0;
	$scope.activateDeveloperMode = function(){
		dev_clicked += 1;
		if(dev_clicked > 5){
			$scope.developerMode = true;
			Toast.show('Developer mode activated!');
		}
	};

	$scope.clearCache = function() {

		$cordovaDialogs.confirm(
		lngTranslate('dialog_clear_cache_message'),
		lngTranslate('dialog_clear_cache_title'), [lngTranslate('yes'), lngTranslate('no')])
		.then(function(buttonIndex) {
			if (buttonIndex == 1) {
				window.localStorage.clear();
				AuthService.credentials.username = null;
				AuthService.credentials.password = null;
				AuthService.credentials.refresh_token = null;
				AuthService.logout();
				$state.go('start');
			}
		});

	};

	$scope.submitDeviceToken = function(){
		$http({
			method: 'GET',
			url: 'http://mycode.in.ua/app/save_push.php?token='+window.localStorage['deviceToken']
		}).then(function(){
			Toast.show('You device token: '+window.localStorage['deviceToken']);
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



});