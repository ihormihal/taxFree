/* TRIPS & TRIP SCREEN */

angular.module('app.controller.trips', [])

/*** LIST ***/
/* 
	- display list of trips
	- add new trip 
*/
.controller('tripsCtrl', function($rootScope, $scope, $state, $stateParams, $ionicModal, $cordovaDatePicker, Trips, Trip, Toast) {


	if ($rootScope.transports.length === 0 || $rootScope.countries.length === 0) {
		$rootScope.loadCatalog();
	}

	var now = $rootScope.currentTime();

	$scope.trip = { id: 'add' };

	$scope.load = function() {

		$rootScope.loading = true;
		Trips.query({}, function(data) {
			$rootScope.trips = data;
			if ($rootScope.trips.length == 0) Toast.show(lngTranslate('no_data'));
			defineTripStatus();
		});

	};

	$scope.load();

	function defineTripStatus() {
		$rootScope.loading = false;
		$scope.$broadcast('scroll.refreshComplete');

		for (var i = 0; i < $rootScope.trips.length; i++) {
			var status = '';
			if ($rootScope.trips[i].date_start > now) {
				status = 'future';
			}
			if ($rootScope.trips[i].date_start < now && $rootScope.trips[i].date_end > now) {
				status = 'current';
			}
			if ($rootScope.trips[i].date_end < now) {
				status = 'past';
			}
			$rootScope.trips[i].time_status = status;
		}
	}

	$ionicModal.fromTemplateUrl('views/private/trips/add.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;

		if($stateParams.action == 'new'){
			$scope.modal.show();
		}
	
	});

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.addTrip = function() {
		$scope.modal.show();
	};

	$scope.create = function() {
		$rootScope.formWaiting = true;
		Trip.add($scope.trip, function(data) {
			$rootScope.formWaiting = false;
			if (data.id) {
				$scope.modal.hide();
				Toast.show(lngTranslate('toast_trip_created'));
				$state.go('main.trip.data', { id: data.id });
			} else {
				Toast.show(lngTranslate('error_general'));
			}
		});
	};

	$scope.$watch('trip.date_start', function() {
		if (!$scope.trip) return false;
		if ($scope.trip.date_end < $scope.trip.date_start) {
			$scope.trip.date_end = $scope.trip.date_start;
		}
	});

	$scope.$watch('trip.date_end', function() {
		if (!$scope.trip) return false;
		if ($scope.trip.date_end < $scope.trip.date_start) {
			$scope.trip.date_start = $scope.trip.date_end;
		}
	});

	$scope.press = function(event){
		console.log(angular.toJson(event));
	};

})


/*** ITEM ***/
/*
	- display single trip
	- edit trip
*/
.controller('tripCtrl', function($rootScope, $scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Trip, TripChecks, TripDeclarations, Check, Toast) {

	if ($rootScope.transports.length === 0 || $rootScope.countries.length === 0) {
		$rootScope.loadCatalog();
	}

	$scope.check = { id: 'add', trip: $stateParams.id, files: [], images: [] };

	var tripDate = {
		start: 0,
		end: 0
	};

	$scope.load = function() {
		$rootScope.loading = true;

		Trip.get({ id: $stateParams.id }, function(data) {
			$scope.trip = data;

			tripDate.start = $scope.trip.date_start;
			tripDate.end = $scope.trip.date_end;
			
			$scope.trip.current = false;

			var dateFrom = $scope.trip.date_start + $scope.trip.time_start;
			var dateTo = $scope.trip.date_end + $scope.trip.time_end;
			if(dateFrom < $rootScope.currentTime() && $rootScope.currentTime() < dateTo && $scope.trip.status !== 'refused'){
				$scope.trip.current = true;
			}

			$scope.loadChecks();
			$scope.loadDeclarations();

			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

	$scope.loadChecks = function() {
		$rootScope.loading = true;
		if ($scope.trip.checks.length == 0) {
			if ($state.current.name == 'main.trip.checks') {
				Toast.show(lngTranslate('no_data'));
			}
		} else {
			$rootScope.loading = true;
			TripChecks.query({ id: $stateParams.id }, function(data) {
				$scope.checks = data;
				$rootScope.loading = false;
			});
		}
		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.loadDeclarations = function() {
		$rootScope.loading = true;
		if ($scope.trip.declarations.length == 0) {
			if ($state.current.name == 'main.trip.declarations') {
				Toast.show(lngTranslate('no_data'));
			}
		} else {
			$rootScope.loading = true;
			TripDeclarations.query({ id: $stateParams.id }, function(data) {
				$scope.declarations = data;
				$rootScope.false = true;
			});
		}
		$scope.$broadcast('scroll.refreshComplete');
	};

	$ionicModal.fromTemplateUrl('views/private/trips/edit.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalTrip = modal;
	});

	$ionicModal.fromTemplateUrl('views/private/trips/add-check.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalCheck = modal;
	});

	$scope.closeModal = function() {
		$scope.modalTrip.hide();
		$scope.modalCheck.hide();
		$scope.trip.date_start = tripDate.start;
		$scope.trip.date_end = tripDate.end;
	};

	$scope.editTrip = function(){
		$scope.trip.date_start = tripDate.start + $scope.trip.time_start;
		$scope.trip.date_end = tripDate.end + $scope.trip.time_start;
		$scope.modalTrip.show();
	};
	

	$scope.$on('$destroy', function() {
		$scope.modalTrip.remove();
		$scope.modalCheck.remove();
	});

	$scope.update = function() {
		Trip.update($scope.trip, function() {
			Toast.show(lngTranslate('toast_trip_updated'));
			$scope.closeModal();
			$scope.load();
		});
	};

	$scope.delete = function() {
		$cordovaDialogs.confirm(
				lngTranslate('dialog_remove_trip_message'),
				lngTranslate('dialog_remove_trip_title'), [lngTranslate('yes'), lngTranslate('no')])
			.then(function(buttonIndex) {
				if (buttonIndex == 1) {
					Trip.delete({id: $scope.trip.id}, function() {
						Toast.show(lngTranslate('toast_trip_deleted'));
						$state.go('main.trips');
					});
				}
			});
	};

	$scope.createCheck = function() {
		var ready = true;
		for (var i = 0; i < $scope.check.images.length; i++) {
			if ($scope.check.images[i].progress == 100) {
				$scope.check.files.push($scope.check.images[i].src);
			} else {
				ready = false;
			}
		}
		if (ready) {
			$scope.check.images = [];
			Check.add($scope.check, function(data) {
				if (data.id) {
					$scope.closeModal();
					$scope.check.images = [];
					Toast.show(lngTranslate('toast_check_created'));
					$state.go('main.check', { id: data.id });
				} else {
					Toast.show(lngTranslate('error_general'));
				}
			});
		} else {
			Toast.show(lngTranslate('please_wait_uploading'));
		}
	};

	$scope.$watch('trip.date_start', function() {
		if (!$scope.trip) return false;
		if ($scope.trip.date_end < $scope.trip.date_start) {
			$scope.trip.date_end = $scope.trip.date_start;
		}
	});

	$scope.$watch('trip.date_end', function() {
		if (!$scope.trip) return false;
		if ($scope.trip.date_end < $scope.trip.date_start) {
			$scope.trip.date_start = $scope.trip.date_end;
		}
	});

});
