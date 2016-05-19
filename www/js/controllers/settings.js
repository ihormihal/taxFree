/*** SETTINGS SCREEN ***/
/* 
	- edit application language
	- edit account settings
*/

angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $ionicPlatform, $http, $scope, Settings, Toast) {

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

	$ionicPlatform.ready(function() {
		$scope.load();
	});

	function switchLang (){
		if(window.localStorage['lang'] !== $scope.appSettings.language){
			window.localStorage['lang'] = $scope.appSettings.language;
			window.location.reload(true);
		}
	}

	$scope.save = function() {

		Settings.update({settings: angular.toJson($scope.settings)}, function(data){
			Toast.show(lngTranslate('settings_saved'));
			switchLang();
		});
		
	};


});