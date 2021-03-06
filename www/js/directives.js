angular.module('app.directives', [])

.filter('translate', function() {
	return lngTranslate;
})

.filter('isPast', function() {
	return function(time) {
		return Date.now() > parseInt(time);
	}
})

.filter('cardNumber', function() {
	return function(num) {
		if (num) {
			var number = num.split('');
			var string = '';
			for (var i = 0; i < number.length; i++) {
				if (i % 4 == 0 && i !== 0) {
					string += '-';
				}
				string += number[i];
			}
			return string;
		}
	}
})

.filter('top5Countries', function() {
	var top = [1,176,221];
	return function(array) {
		var topArray = [];
		for (var i = 0; i < top.length; i++) {
			for (var j = 0; j < array.length; j++) {
				if(parseInt(array[j].id) == top[i]){
					topArray.push(array[j]);
					array.splice(j,1);
				}
			}
		}
		for (var i = topArray.length - 1; i >= 0; i--) {
			array.unshift(topArray[i]);
		}
		
		return array;
	}
})


.filter('getStatusIcon', function() {
	return function(status) {
		if (status in window.icons) {
			return window.icons[status];
		}
	}
})

.directive('tabform', [function() {
	return {
		restrict: 'A',
		controller: function($scope, $element, $attrs){
			var inputs = $element[0].querySelectorAll('input, select');
			angular.forEach(inputs, function(input){
				input.onkeypress = function(event){
					if(event.keyCode == 13){
						//go to
					}
				};
			})
		}
	}
}])

// .directive('phoneEmail', [function() {
// 	return {
// 		restrict: 'A',
// 		require: '?ngModel',
// 		scope: {
// 			ngModel: '='
// 		},
// 		link: function($scope, $element, $attrs, ngModel){
// 			ngModel.$parsers.push(function(modelValue) {
// 				console.log(modelValue);
				
// 			});

// 		}
// 	}
// }])

.directive('datetime', [function(dateFilter) {
	return {
		restrict: 'A',
		require: '?ngModel',
		scope: {
			ngModel: '='
		},
		link: function($scope, $element, $attrs, ngModel){
			ngModel.$formatters.push(function(modelValue) {
				var val = parseInt(modelValue) * 1000;
				var offset = new Date(val).getTimezoneOffset() * 60 * 1000;
				var output = new Date(val + offset);

				return output; //return Date
			});

			//remove milliseconds
			if (ionic.Platform.isAndroid() && parseInt(ionic.Platform.version()) < 5 && $attrs.type == 'time') {
				ngModel.$formatters.unshift(function(value) {
					return value.replace(/:\d{2}[.,]\d{3}$/, '')
				});
			}

			ngModel.$parsers.push(function(viewValue) {

				if (viewValue instanceof Date) {
					var val = viewValue.getTime();
					var offset = viewValue.getTimezoneOffset() * 60 * 1000;
					var output = parseInt((val - offset)/1000);
					if(output < 0){
						//crutch for timepicker (because 1969 year!!!)
						output = 86400 + output;
					}
					return output; //return Timestamp
				}
			});
		},
		controller: function($scope, $element, $attrs, $cordovaDatePicker) {

			var datepickerOptions = {
				date: new Date(),
				mode: $attrs.type || 'date',
				//minDate: new Date() - 10000,
				allowOldDates: true,
				allowFutureDates: true,
				doneButtonLabel: 'DONE',
				doneButtonColor: '#F2F3F4',
				cancelButtonLabel: 'CANCEL',
				cancelButtonColor: '#000000'
			};

			if(ionic.Platform.isAndroid() && parseInt(ionic.Platform.version()) < 5){
				$element[0].onclick = function(){
					try {
						$cordovaDatePicker.show(datepickerOptions).then(function(date) {
							//$scope.ngModel = date;
							if (date instanceof Date) {
								var val = date.getTime();
								var offset = date.getTimezoneOffset() * 60 * 1000;
								var output = parseInt((val - offset)/1000);
								if(output < 0){
									//crutch for timepicker (because 1969 year!!!)
									output = 86400 + output;
								}
								$scope.ngModel = output; //return Timestamp
							}
						});
					} catch (error) {
						console.log(error);
					}
				};
			}
		}
	}
}])

.directive('integerModel', [ function() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function($scope, $element, $attrs, ngModel) {
			ngModel.$formatters.push(function(value) {
				if (value !== null && value !== undefined) {
					return value.toString();
				}
			});
			ngModel.$parsers.push(function(value) {
				if (value !== null) {
					return parseInt(value);
				}
			});
		}
	}
}])

.filter('safeImg', function() {
	return function(src) {
		if (src) {
			return src + '?token=' + window.localStorage['token'];
		}
	}
})

.directive('safeSrc', [ function() {
	return {
		restrict: 'A',
		controller: function($rootScope, $scope, $element, $attrs, $cordovaFile, $cordovaFileTransfer, Toast) {
			$attrs.$observe('safeSrc', function(src) {
				if(src){

					var filename = src.split("/").pop();

					var ext = filename.split(".").pop();
					if(ext !== 'jpg' && ext !== 'jpeg' && ext !== 'gif' && ext !== 'png'){
						$attrs.$set('src', '');
						return false;
					}

					var safeSrc = src + '?token=' + window.localStorage['token'];

					try {
						var cacheDirectory = cordova.file.cacheDirectory;
						var cachedSrc = cacheDirectory + filename;

						$cordovaFile.checkFile(cacheDirectory, filename)
							.then(function(success) {
								// success
								$attrs.$set('src', cachedSrc);
							}, function(error) {
								//download image
								$rootScope.loading = true;
								$cordovaFileTransfer.download(safeSrc, cachedSrc, {trustAllHosts: true}, true)
								.then(function(success){
									$attrs.$set('src', cachedSrc);
									$rootScope.loading = false;
								}, function(error) {
									$rootScope.loading = false;
									$attrs.$set('src', safeSrc);
								});
							});

					} catch (error) {
						console.log(error);
						$attrs.$set('src', safeSrc);
					}

				}
			});

			// var loading = true;
			// $element.bind('load', function() {
			// 	loading = false;
			// });
		}
	}
}])


.directive('imageViewer', [ function() {
	return {
		restrict: 'A',
		controller: function($scope, $element, $attrs) {
			$element[0].onclick = function() {
				var ext = $attrs.src.split(".").pop();
				if(ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png'){
					PhotoViewer.show($attrs.src, $attrs.alt, {share:false});
				}
			}
		}
	}
}])


.directive('chooseImages', [ function() {
	return {
		restrict: 'E',
		scope: {
			images: '='
		},
		templateUrl: 'views/tpl/choose-images.html',
		controller: function($rootScope, $scope, $element, $attrs, $timeout, $cordovaImagePicker, $cordovaFile, $cordovaFileTransfer, $cordovaActionSheet, $cordovaCamera, $cordovaToast) {
			
			if ($attrs.single == 'true') {
				$scope.single = true;
			}
			var filekey = $attrs.filekey ? $attrs.filekey : 'file';

			$scope.selectPhoto = function() {

				try {
					$cordovaActionSheet.show({
						title: lngTranslate('action_choose_photo_title'),
						buttonLabels: [lngTranslate('camera'), lngTranslate('gallery')],
						addCancelButtonWithLabel: lngTranslate('cancel'),
						androidEnableCancelButton: true,
						winphoneEnableCancelButton: true
					})
						.then(function(btnIndex) {
							switch (btnIndex) {
								case 1:
									$scope.fromCamera();
									break;
								case 2:
									$scope.fromGallery();
									break;
									defaut: break;
							}
						});
				} catch (error) {
					console.log(error);
				}

			};

			$scope.fromGallery = function() {

				window.imagePicker.getPictures(
					function(files) {
						for (var i = 0; i < files.length; i++) {
							$scope.images.push({
								src: files[i],
								progress: 0,
								error: false
							});
							$scope.uploadPhoto(files[i], $scope.images.length - 1);
						}
					},
					function(error) {
						$cordovaToast.show(error, 'short', 'top');
					},
					{
						maximumImagesCount: ($scope.single ? 1 : 10)
					}
				);

				
				// $cordovaImagePicker.getPictures({
				// 	maximumImagesCount: ($scope.single ? 1 : 10)
				// })
				// 	.then(function(files) {
				// 		for (var i = 0; i < files.length; i++) {
				// 			$scope.images.push({
				// 				src: files[i],
				// 				progress: 0,
				// 				error: false
				// 			});
				// 			$scope.uploadPhoto(files[i], $scope.images.length - 1);
				// 		}
				// 	}, function(error) {
				// 		$cordovaToast.show(error, 'short', 'top');
				// 	});
			};

			$scope.fromCamera = function() {
				$cordovaCamera.getPicture({
					destinationType: Camera.DestinationType.FILE_URI,
					sourceType: Camera.PictureSourceType.CAMERA,
					encodingType: Camera.EncodingType.JPEG,
					mediaType: Camera.MediaType.PICTURE,
					correctOrientation: true,
					saveToPhotoAlbum: false
				})
					.then(function(image) {
						console.log('Camera getPicture SUCCESS');
						$scope.images.push({
							src: image,
							progress: 0,
							error: false
						});
						$scope.uploadPhoto(image, $scope.images.length - 1);
					}, function(error) {
						console.log('Camera getPicture ERROR');
						$cordovaToast.show(angular.toJson(error), 'short', 'top');
					});
			};

			$scope.uploadPhoto = function(file, i) {
				var options = {
					headers: {
						'Authorization': window.localStorage['token']
					},
					fileKey: filekey,
					fileName: "photo.jpg",
					chunkedMode: false,
					mimeType: "image/jpeg",
					trustAllHosts: true,
					params: {user: $attrs.userid}
				};

				// $cordovaFileTransfer.upload(
				// 	encodeURI($rootScope.config.domain + $attrs.url),
				// 	file,
				// 	options)
				// 	.then(function(data) {
				// 		var response = angular.fromJson(data.response);
				// 		if ($scope.single) {
				// 			$scope.images[i].src = response[filekey];
				// 		} else {
				// 			$scope.images[i].src = response[0];
				// 		}
				// 		$scope.images[i].progress = 100;
				// 		$scope.images[i].error = false;
				// 		$cordovaCamera.cleanup();
				// 	}, function(error) {
				// 		$scope.images[i].error = true;
				// 		$cordovaCamera.cleanup();
				// 	}, function(progress) {
				// 		$scope.images[i].progress = Math.floor(progress.loaded * 100 / progress.total);
				// 	}, true);

				console.log('File transfer START');

				var ft = new FileTransfer();
				ft.upload(
				file,
				encodeURI($rootScope.config.domain + $attrs.url),
				function(data) {
					console.log('File transfer SUCCESS');
					var response = angular.fromJson(data.response);
					if ($scope.single) {
						$scope.images[i].src = response[filekey];
					} else {
						$scope.images[i].src = response[0];
					}
					$scope.images[i].progress = 100;
					$scope.images[i].error = false;
					$scope.$apply();
					console.log('$cordovaCamera cleanup');
					$cordovaCamera.cleanup();
				}, function(error) {
					console.log('File transfer ERROR');
					$scope.images[i].error = true;
					$scope.$apply();
					$cordovaCamera.cleanup();
				},
				options, true);

				ft.onprogress = function(progress) {
					if (progress.lengthComputable) {
						$scope.images[i].progress = Math.floor(progress.loaded * 100 / progress.total);
						console.log($scope.images[i].progress);
						$scope.$apply();
					}
				};
			};

			$scope.removeImage = function(index){
				var removeFile = $scope.images[index].src.split("/").pop();
				$scope.images.splice(index,1);
				try {
					$cordovaFile.removeFile(cordova.file.cacheDirectory, removeFile);
				} catch (error) {
					console.log(error);
				}
			};
		}
	};
}])

.directive('progressBar', [function() {
	return {
		restrict: 'E',
		scope: {
			progress: '='
		},
		templateUrl: 'views/tpl/progress-bar.html',
		controller: function($scope, $element, $attrs) {
			var circleRadius = parseInt($attrs.radius);
			var stokeWidth = parseInt($attrs.width);
			var circleCenter = circleRadius + stokeWidth/2;
			var viewSize = circleCenter * 2;

			var dashLength = 2 * Math.PI * circleRadius;
			var dashOffset = dashLength / 4;

			$scope.offset = dashLength; //zero position
			var svg = $element[0].getElementsByTagName('svg')[0];
			var emptyBar = $element[0].getElementsByTagName('circle')[0];
			var progressBar = $element[0].getElementsByTagName('circle')[1];

			svg.setAttribute('width', viewSize);
			svg.setAttribute('height', viewSize);
			svg.setAttribute('viewBox', '0 0 '+viewSize+' '+viewSize);

			emptyBar.setAttribute('cx', circleCenter);
			emptyBar.setAttribute('cy', circleCenter);
			emptyBar.setAttribute('stroke-dasharray', dashLength);
			emptyBar.setAttribute('r', circleRadius);
			emptyBar.setAttribute('stroke-width', stokeWidth);

			progressBar.setAttribute('cx', circleCenter);
			progressBar.setAttribute('cy', circleCenter);
			progressBar.setAttribute('transform', 'rotate(-90 '+circleCenter+' '+circleCenter+')');

			progressBar.setAttribute('stroke-dasharray', dashLength);
			progressBar.setAttribute('r', circleRadius);
			progressBar.setAttribute('stroke-width', stokeWidth);

			$scope.$watch('progress', function(progress) {
				var value = parseInt(progress);
				if (isNaN(value)) value = 0;

				if (value < 0) value = 0;
				if (value > 100) value = 100;

				$scope.offset = ((100 - value) / 100) * dashLength;
			});
		}
	}
}]);
