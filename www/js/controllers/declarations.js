angular.module('app.controller.declarations', [])

/*** LIST ***/
.controller('declarationsCtrl', function($rootScope, $scope, Declarations, Toast) {

	$scope.load = function() {
		$rootScope.loading = true;
		Declarations.query({}, function(data) {
			$scope.declarations = data;
			if ($scope.declarations.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

})

/*** ITEM ***/
.controller('declarationCtrl', function($rootScope, $scope, $stateParams, $cordovaFile, $cordovaFileTransfer, Declaration, Toast) {

	$scope.declarationFile = {
		exist: false,
		name: null,
		path: null
	};

	$scope.invoiceFile = {
		exist: false,
		name: null,
		path: null
	};

	var transferOptions = {
		headers: {
			'Authorization': window.localStorage['token']
		}
	};

	var fileDirectory = '';
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

	$scope.load = function() {
		$rootScope.loading = true;
		Declaration.get({
			id: $stateParams.id
		}, function(data) {
			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.declaration = data;

			//$scope.declaration.file = 'http://mycode.in.ua/app/Declaration_GB.pdf'; //for test
			$scope.declaration.invoice = 'http://mycode.in.ua/app/Declaration_GB.pdf'; //for test

			if($scope.declaration.file){
				$scope.declarationFile.name = $scope.declaration.file.split("/").pop();
			}
			if($scope.declaration.invoice){
				$scope.invoiceFile.name = $scope.declaration.invoice.split("/").pop();
			}

			$scope.declarationFile.path = fileDirectory + $scope.declarationFile.name;
			$scope.invoiceFile.path = fileDirectory + $scope.invoiceFile.name;

			//Check for the downloaded file.
			try {
				$cordovaFile.checkFile(fileDirectory, $scope.declarationFile.name)
					.then(function() {
						$scope.declarationFile.exist = true;
					});
				$cordovaFile.checkFile(fileDirectory, $scope.invoiceFile.name)
					.then(function() {
						$scope.invoiceFile.exist = true;
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
			$scope.load();
		});
	};

	$scope.downloadDeclaration = function() {

		$cordovaFileTransfer.download($scope.declaration.file, $scope.declarationFile.path, transferOptions, true)
			.then(function(result) {
				Toast.show(lngTranslate('download_success'));
				$scope.declarationFile.exist = true;
				$scope.$apply();
			}, function(error) {
				Toast.show(lngTranslate('download_error') + ' ' + angular.toJson(error));
			}, function(progress) {
				// PROGRESS HANDLING GOES HERE
			});
	};

	$scope.downloadInvoice = function() {

		$cordovaFileTransfer.download($scope.declaration.invoice, $scope.invoiceFile.path, transferOptions, true)
			.then(function(result) {
				Toast.show(lngTranslate('download_success'));
				$scope.invoiceFile.exist = true;
				$scope.$apply();
			}, function(error) {
				Toast.show(lngTranslate('download_error') + ' ' + angular.toJson(error));
			}, function(progress) {
				// PROGRESS HANDLING GOES HERE
			});
	};

	$scope.openFile = function(path) {
		cordova.plugins.disusered.open(path, function() {
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
.controller('paymentsCtrl', function($rootScope, $scope, Payments, Toast) {

	$scope.load = function() {
		$rootScope.loading = true;
		Payments.query({}, function(data) {
			$scope.payments = data;
			if ($scope.payments.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();
})

;