/*** SETTINGS SCREEN ***/
/* 
	- edit application language
	- edit account settings
*/

angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $ionicPlatform, $http, $scope, Settings, Toast) {

	$scope.load = function(){
		$rootScope.loading = true;
		Settings.get({}, function(data){
			$scope.settings = data;
			if(!$scope.settings.language){
				$scope.settings.language = window.localStorage['lang']
			}
			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$ionicPlatform.ready(function() {
		$scope.load();
	});

	function switchLang (){
		if(window.localStorage['lang'] !== $scope.settings.language){
			window.localStorage['lang'] = $scope.settings.language;
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