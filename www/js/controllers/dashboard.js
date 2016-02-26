angular.module('app.controller.dashboard', [])

.controller('dashboardCtrl', function($scope, Dashboard, DashboardAction, DashboardNoaction) {

	$scope.itemActive = 0;

	$scope.toggleItem = function(index) {
		if ($scope.itemActive == index) {
			$scope.itemActive = null;
		} else {
			$scope.itemActive = index;
		}
	};

	$scope.load = function() {

		DashboardAction.get({
			request: 'list'
		}, function(data) {
			$scope.actionlist = data;
		});

		Dashboard.get({
			request: 'allpayments'
		}, function(data) {
			$scope.allpayments = data;
		});

		Dashboard.get({
			request: 'lastapprovedpayment'
		}, function(data) {
			$scope.lastapprovedpayment = data;
		});

		DashboardNoaction.get({
			request: 'list'
		}, function(data) {
			$scope.noactionlist = data;
		});

		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.load();


});