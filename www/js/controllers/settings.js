angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $scope, $state, $ionicPopup, $cordovaDialogs, AuthService) {

	$scope.settings = {
		language: window.localStorage['lang']
	};

	$scope.language = window.localStorage['lang'];

	$scope.save = function() {
		window.localStorage['lang'] = $scope.settings.language;
		window.location.reload(true);
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
});