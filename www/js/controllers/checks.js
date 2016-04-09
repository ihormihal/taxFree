angular.module('app.controller.checks', [])

/*** LIST ***/
.controller('checksCtrl', function($rootScope, $scope, $state, $ionicModal, Checks, Check, Trip, Trips, Toast) {

	if($rootScope.transports.length === 0 || $rootScope.countries.length === 0){
      $rootScope.loadCatalog();
    }

	$scope.checks = [];
	$scope.activeTrips = [];
	$scope.check = {
		id: 'add',
		trip: '',
		files: [],
		images: []
	};

	$scope.load = function() {
		$rootScope.loading = true;
		Checks.query({}, function(data) {
			$scope.checks = data;
			if ($scope.checks.length == 0) {
				Toast.show(lngTranslate('no_data'));
				$scope.$broadcast('scroll.refreshComplete');
			}
			$scope.complete();
		});
	};

	$scope.load();

	$scope.complete = function() {
		if($rootScope.trips.length){
			assignTrip();
		}else{
			Trips.query({}, function(data) {
				$rootScope.trips = data;
				assignTrip();
			});
		}
	};

	var tripsloaded = false;
	function assignTrip (){
		$rootScope.loading = false;
		$scope.$broadcast('scroll.refreshComplete');

		angular.forEach($scope.checks, function(check, i) {
			var trip_id = 0;
			angular.forEach($rootScope.trips, function(trip) {
				if (trip.id == check.trip) {
					var trip_id = trip.id;
					$scope.checks[i].country_enter = $rootScope.getById($rootScope.countries, trip.country_enter).name;
					$scope.checks[i].country_leaving = $rootScope.getById($rootScope.countries, trip.country_leaving).name;
				}
			});
			//if trip not found in stored data
			if(trip_id == 0 && !tripsloaded){
				Trips.query({}, function(data) {
					$rootScope.trips = data;
					tripsloaded = true;
					assignTrip();
				});
			}
		});

		$scope.activeTrips = [];
		angular.forEach($rootScope.trips, function(trip,i){
			if(trip.date_end > $rootScope.currentTime() && trip.status !== 'refused'){
				$scope.activeTrips.push(trip);
			}
		});
	}

	$ionicModal.fromTemplateUrl('views/private/checks/add.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalCheck = modal;
	});

	$scope.$on('$destroy', function() {
		$scope.modalCheck.remove();
	});

	$scope.create = function() {
		var ready = true;
		for (var i = 0; i < $scope.check.images.length; i++) {
			if ($scope.check.images[i].progress == 100) {
				$scope.check.files.push($scope.check.images[i].src);
			} else {
				ready = false;
			}
		}
		if (ready) {
			Check.add($scope.check, function(data) {
				if(data.id){
					$scope.check.images = [];
					$scope.modalCheck.hide();
					Toast.show(lngTranslate('toast_check_created'));
					$state.go('main.check', {id: data.id});
				}else{
					Toast.show(lngTranslate('error_general'));
				}
			});
		} else {
			Toast.show(lngTranslate('please_wait_uploading'));
		}
	};


})

/*** ITEM ***/
.controller('checkCtrl', function($http, $rootScope, $scope, $stateParams, $ionicModal, $cordovaFile, $cordovaDialogs, Check, Toast, Trips) {



	$scope.load = function(){
		$rootScope.loading = true;
		Check.get({
			id: $stateParams.id
		}, function(data) {
			$scope.check = data;
			$scope.check.images = []; //for new images
			$scope.complete();
		});
	};

	$scope.load();

	function assignTrip (){
		$rootScope.loading = false;
		$scope.$broadcast('scroll.refreshComplete');

		var tripsloaded = false;
		var trip_id = false;
		angular.forEach($rootScope.trips, function(trip) {
			if (trip.id == $scope.check.trip) {
				trip_id = trip.id;
				$scope.check.country_enter = $rootScope.getById($rootScope.countries, trip.country_enter).name;
				$scope.check.country_leaving = $rootScope.getById($rootScope.countries, trip.country_leaving).name;
			}
		});

		//if trip not found in stored data
		if(!trip_id){
			Trips.query({}, function(data) {
				$rootScope.trips = data;
				tripsloaded = true;
				assignTrip();
			});
		}
	}

	$scope.complete = function() {
		if($rootScope.trips.length){
			assignTrip();
		}else{
			Trips.query({}, function(data) {
				$rootScope.trips = data;
				assignTrip();
			});
		}
	};

	$scope.deletePhoto = function(index) {
		var removeFile = $scope.check.files[index].split("/").pop();
		$scope.check.files.splice(index, 1);
		try {
			$cordovaFile.removeFile(cordova.file.cacheDirectory, removeFile);
		} catch (error) {
			console.log(error);
		}
	};

	$ionicModal.fromTemplateUrl('views/private/checks/add.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.update = function() {
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
			Check.update({
				id: $scope.check.id
			}, $scope.check, function() {
				Toast.show(lngTranslate('toast_check_updated'));
			});
		} else {
			Toast.show(lngTranslate('please_wait_uploading'));
		}

	};

	$scope.delete = function() {
		$cordovaDialogs.confirm(
			lngTranslate('dialog_remove_check_message'),
			lngTranslate('dialog_remove_check_title'), [lngTranslate('yes'), lngTranslate('no')])
			.then(function(buttonIndex) {
				if (buttonIndex == 1) {
					Check.delete($scope.check.id, function() {
						Toast.show(lngTranslate('toast_check_deleted'));
						$state.go('main.checks');
					});
				}
			});
	};

});