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

.filter('addToken', function() {
	return function(src) {
		return src + '?token=' + window.localStorage['token'];
	}
})

.filter('getStatusIcon', function() {
	return function(status) {
		if (status in window.icons) {
			return window.icons[status];
		}
	}
})


.directive('datetime', [function(dateFilter) {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function($scope, $element, $attrs, ngModel) {

			ngModel.$formatters.push(function(modelValue) {
				return new Date(parseInt(modelValue) * 1000);
			});

			ngModel.$parsers.push(function(viewValue) {
				if (viewValue instanceof Date) {
					var offset = new Date().getTimezoneOffset() * 60;
					var timestamp = viewValue.getTime() / 1000 - offset;
					return Math.abs(timestamp); //prevent negative values
				}
			});
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


.directive('imageViewer', [ function() {
	return {
		restrict: 'A',
		scope: true,
		link: function($scope, $element, $attrs) {
			$scope.loading = true;
			$element[0].onclick = function() {
				PhotoViewer.show($attrs.src, $attrs.alt);
			}
			$element.bind('load', function() {
				$scope.loading = false;
			});
		}
	}
}])


.directive('chooseImages', [ function() {
	return {
		restrict: 'E',
		scope: {
			images: '=',
			params: '='
		},
		templateUrl: 'views/tpl/choose-images.html',
		controller: function($scope, $element, $attrs, $timeout, $cordovaImagePicker, $cordovaFileTransfer, $cordovaActionSheet, $cordovaCamera, $cordovaToast) {

			if ($attrs.single == 'true') {
				$scope.single = true;
			}

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
				$cordovaImagePicker.getPictures({
					maximumImagesCount: ($scope.single ? 1 : 10)
				})
					.then(function(files) {
						for (var i = 0; i < files.length; i++) {
							$scope.images.push({
								src: files[i],
								progress: 0,
								error: false
							});
							$scope.uploadPhoto(files[i], $scope.images.length - 1);
						}
					}, function(error) {
						$cordovaToast.show(error, 'short', 'top');
					});
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
						$scope.images.push({
							src: image,
							progress: 0,
							error: false
						});
						$scope.uploadPhoto(image, $scope.images.length - 1);
					}, function(error) {
						$cordovaToast.show(angular.toJson(error), 'short', 'top');
					});
			};

			$scope.uploadPhoto = function(file, i) {
				var options = {
					headers: {
						'Authorization': window.localStorage['token']
					},
					fileKey: "file",
					fileName: "photo.jpg",
					chunkedMode: false,
					mimeType: "image/jpeg",
					params: $scope.params
				};
				var time = new Date().getTime();
				$cordovaFileTransfer.upload(
					encodeURI(window.AppSettings.domain + $attrs.url),
					file,
					options)
					.then(function(data) {
						var response = angular.fromJson(data.response);
						if ($scope.single) {
							$scope.images[i].src = response.file;
						} else {
							$scope.images[i].src = response[0];
						}
						$scope.images[i].progress = 100;
						$scope.images[i].error = false;
						$cordovaCamera.cleanup();
					}, function(error) {
						$scope.images[i].error = true;
						$cordovaCamera.cleanup();
						$cordovaToast.show(angular.toJson(error), 'short', 'top');
					}, function(progress) {
						$scope.images[i].progress = Math.floor(progress.loaded * 100 / progress.total);
					});
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
			//circleRadius = 90;
			var stokeWidth = parseInt($attrs.width);
			//stokeWidth = 10;
			var circleCenter = circleRadius + stokeWidth;
			var viewSize = circleCenter * 2;

			var dashLength = 2 * Math.PI * circleRadius;
			var dashOffset = dashLength / 4;

			$scope.offset = 0;
			var svg = $element[0].getElementsByTagName('svg')[0];
			var emptyBar = $element[0].getElementsByTagName('circle')[0];
			var progressBar = $element[0].getElementsByTagName('circle')[1];

			svg.setAttribute('width', viewSize);
			svg.setAttribute('height', viewSize);

			emptyBar.setAttribute('cx', circleCenter);
			emptyBar.setAttribute('cy', circleCenter);
			progressBar.setAttribute('cx', circleCenter);
			progressBar.setAttribute('cy', circleCenter);

			emptyBar.setAttribute('stroke-dasharray', dashLength);
			//progressBar.setAttribute('stroke-dashoffset',dashOffset);

			progressBar.setAttribute('stroke-dasharray', dashLength);
			//progressBar.setAttribute('stroke-dashoffset',dashOffset);

			emptyBar.setAttribute('r', circleRadius);
			progressBar.setAttribute('r', circleRadius);

			emptyBar.setAttribute('stroke-width', stokeWidth);
			progressBar.setAttribute('stroke-width', stokeWidth);


			$scope.$watch('progress', function(progress) {
				var value = parseInt(progress);
				if (isNaN(value)) {
					value = 0;
				} else {
					var r = progressBar.getAttribute('r');
					var c = Math.PI * (r * 2);

					if (value < 0) {
						value = 0;
					}
					if (value > 100) {
						value = 100;
					}

					$scope.offset = ((100 - value) / 100) * dashLength;
				}
			});
		}
	}
}]);