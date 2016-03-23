angular.module('app.controller.declarations', [])

/*** LIST ***/
.controller('declarationsCtrl', function($scope, Declarations, Toast) {

	$scope.load = function() {
		Declarations.query({}, function(data) {
			$scope.declarations = data;
			if ($scope.declarations.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

})

/*** ITEM ***/
.controller('declarationCtrl', function($scope, $stateParams, $cordovaFile, $cordovaFileTransfer, Declaration, Toast) {

	$scope.file = {
		exist: false,
		name: null,
		path: null
	};

	$scope.load = function() {
		Declaration.get({
			id: $stateParams.id
		}, function(data) {
			$scope.$broadcast('scroll.refreshComplete');
			$scope.declaration = data;

			//$scope.declaration.file = $scope.declaration.file.replace('app_dev.php/','');
			//$scope.declaration.file = 'http://mycode.in.ua/app/Declaration_GB.pdf'; //for test

			var fileDirectory = '';

			$scope.file.name = $scope.declaration.file.split("/").pop();
			try {
				if (ionic.Platform.isIOS()) {
					fileDirectory = cordova.file.documentsDirectory;
					/* file /var/mobile/Containers/Data/Application/<UUID>/Documents/ */
				} else {
					fileDirectory = cordova.file.externalDataDirectory;
					/* Android/data/<app-id>/files */
				}
			} catch (error) {
				console.log(error);
			}

			$scope.file.path = fileDirectory + $scope.file.name;

			//Check for the downloaded file.
			try {
				$cordovaFile.checkFile(fileDirectory, $scope.file.name)
					.then(function() {
						$scope.file.exist = true;
					});
			} catch (error) {
				console.log(error);
			}

		});

	};
	$scope.load();

	$scope.deliveryMethod = function(method) {
		Declaration.update({
			id: $stateParams.id,
			type: method
		}, function(data) {
			Toast.show(lngTranslate('delivery_method_success') + ': ' + lngTranslate(method));
			$scope.doRefresh();
		});
	};

	$scope.download = function() {

		var options = {
			headers: {
				'Authorization': window.localStorage['token']
			}
		};

		$cordovaFileTransfer.download($scope.declaration.file, $scope.file.path, options, true)
			.then(function(result) {
				Toast.show(lngTranslate('download_success'));
				$scope.file.exist = true;
				$scope.$apply();
			}, function(error) {
				Toast.show(lngTranslate('download_error') + ' ' + angular.toJson(error));
			}, function(progress) {
				// PROGRESS HANDLING GOES HERE
			});

	};

	$scope.openfile = function() {
		cordova.plugins.disusered.open($scope.file.path, function() {
			//success
		}, function() {
			if (code === 1) {
				Toast.show(lngTranslate('open_file_error'));
			} else {
				Toast.show(lngTranslate('undefined_error'));
			}
		});
	};

})

/*** PAYMENTS ***/
.controller('paymentsCtrl', function($scope, Payments, Toast) {

	$scope.load = function() {
		Payments.query({}, function(data) {
			$scope.payments = data;
			if ($scope.payments.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();
})

;