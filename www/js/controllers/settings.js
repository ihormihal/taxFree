angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $scope, $state, $ionicPopup, $cordovaDialogs, $cordovaPush, Settings, AuthService, Alert, Toast) {

	$scope.appSettings = {
		language: window.localStorage['lang']
	};


	Settings.get({}, function(data){
		$scope.settings = data;
	});

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

	// $scope.pushUnregister = function() {
	// 	$cordovaPush.unregister().then(function(result) {
	// 		Alert.show({
	// 			title: 'Push Unregister Success',
	// 			message: angular.toJson(result)
	// 		});
	// 	}, function(error) {
	// 		Alert.show({
	// 			title: 'Push Unregister Error',
	// 			message: angular.toJson(error)
	// 		});
	// 	});
	// };

	$scope.save = function() {
		if(window.localStorage['lang'] !== $scope.appSettings.language){
			window.localStorage['lang'] = $scope.appSettings.language;
			window.location.reload(true);
		}
		Settings.update({settings: angular.toJson($scope.settings)}, function(data){
			Toast.show(lngTranslate('settings_saved'));
		});
	};

});