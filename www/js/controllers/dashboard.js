angular.module('app.controller.dashboard', [])

.controller('dashboardCtrl', function($scope, Dashboard) {

	$scope.itemActive = 0;

	$scope.toggleItem = function(index) {
		if ($scope.itemActive == index) {
			$scope.itemActive = null;
		} else {
			$scope.itemActive = index;
		}
	};

	$scope.load = function() {

		Dashboard.getActionList({}, function(data) {
			$scope.actionlist = data;
		});

		Dashboard.getPayments({}, function(data) {
			$scope.payments = data;
		});

		Dashboard.getLastPayment({}, function(data) {
			$scope.lastpayment = data;
		});

		Dashboard.getNoactionList({}, function(data) {
			$scope.noactionlist = data;
		});

		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.load();


});