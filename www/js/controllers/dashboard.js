/*** DASHBOARD SCREEN ***/
/* 
	- display list of messages
*/

angular.module('app.controller.dashboard', [])

.controller('dashboardCtrl', function($rootScope, $scope, Dashboard) {

	$scope.itemActive = 0;

	$scope.toggleItem = function(index) {
		if ($scope.itemActive == index) {
			$scope.itemActive = null;
		} else {
			$scope.itemActive = index;
		}
	};

	$scope.actionlist = [];
	$scope.noactionlist = [];

	$scope.load = function() {
		$rootScope.loading = true;

		var loaded = 0;

		Dashboard.getActionList({}, function(data) {
			$scope.actionlist = data.notifications;
			for(var i = 0; i < $scope.actionlist.length; i++){
				$scope.actionlist[i].created = new Date($scope.actionlist[i].created);
			}
			loaded++;
			if(loaded == 4) $rootScope.loading = false;
		});

		Dashboard.getNoactionList({}, function(data) {
			$scope.noactionlist = data.notifications;
			for(var i = 0; i < $scope.noactionlist.length; i++){
				$scope.noactionlist[i].created = new Date($scope.noactionlist[i].created);
			}
			loaded++;
			if(loaded == 4) $rootScope.loading = false;
		});

		Dashboard.getPayments({}, function(data) {
			$scope.payments = data;
			loaded++;
			if(loaded == 4) $rootScope.loading = false;
		});

		Dashboard.getLastPayment({}, function(data) {
			$scope.lastpayment = data;
			loaded++;
			if(loaded == 4) $rootScope.loading = false;
		});


		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.load();


});