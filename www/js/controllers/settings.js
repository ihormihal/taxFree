angular.module('app.controller.settings', [])

.controller('settingsCtrl', function($rootScope, $http, $scope, Settings, Toast) {

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


});