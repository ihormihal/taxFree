angular.module('app.directives', [])

.filter('translate', function() {
  return lngTranslate;
})

.filter('isPast', function() {
  return function(time) {
    return Date.now() > parseInt(time);
  }
})


.directive('datetime', function(dateFilter) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element, $attrs, ngModel) {

      ngModel.$formatters.push(function(modelValue) {
        return new Date(parseInt(modelValue) * 1000);
      });

      ngModel.$parsers.push(function(viewValue) {
        if (viewValue instanceof Date) {
          var timestamp = viewValue.getTime() / 1000;
          return Math.abs(timestamp);
        }
      });

    }
  }
})

.directive('integerModel', [function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element, $attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        if(value !== null && value !== undefined){
          return value.toString();
        }
      });
      ngModel.$parsers.push(function(value) {
        if(value !== null){
          return parseInt(value);
        }
      });
    }
  }
}])


.directive('imageViewer', [function() {
  return {
    restrict: 'A',
    scope: true,
    link: function($scope, $element, $attrs) {
      $scope.loading = true;
      $element[0].onclick = function () {
        PhotoViewer.show($attrs.src, $attrs.alt);
      }
      $element.bind('load', function() {
        $scope.loading = false;
      });
    }
  }
}])

.directive('passportImage', [function() {
  return {
    restrict: 'E',
    scope: {
      file: '=',
      url: '@',
      userid: '@'
    },
    templateUrl: 'templates/tpl/choose-image.html',
    controller: function($rootScope, $scope, $timeout, $ionicActionSheet, $cordovaImagePicker, $cordovaDialogs, $cordovaFileTransfer, $cordovaActionSheet, $cordovaCamera, $cordovaToast) {
      $scope.Domain = $rootScope.Domain;
      $scope.loading = false;
      $scope.selectPhoto = function() {

        try {
          $cordovaActionSheet.show({
            title: lngTranslate('action_choose_photo_title'),
            buttonLabels: [lngTranslate('camera'),lngTranslate('gallery')],
            addCancelButtonWithLabel: lngTranslate('cancel'),
            androidEnableCancelButton : true,
            winphoneEnableCancelButton : true
          })
          .then(function(btnIndex) {
            switch (btnIndex) {
              case 1:
                $scope.fromCamera();
                break;
              case 2:
                $scope.fromGallery();
                break;
              defaut:
                break;
            }
          });
        } catch (error) {
          $ionicActionSheet.show({
            buttons: [{
              text: '<i class="icon ion-camera"></i> Камера'
            }, {
              text: '<i class="icon ion-images"></i> Галерея'
            }],
            buttonClicked: function(index) {
              switch (index) {
                case 0:
                  $scope.fromCamera();
                  break;
                case 1:
                  $scope.fromGallery();
                  break;
                  defaut:
                    break;
              }
              return true;
            }
          });
        }

      };

      $scope.fromGallery = function() {
        $cordovaImagePicker.getPictures({
          maximumImagesCount: 1
        })
        .then(function(images) {
          for (var i = 0; i < images.length; i++) {
            $scope.uploadPhoto(images[i]);
          }
        }, function(error) {
          $cordovaToast.show(error, 'short', 'top');
        });
      };

      $scope.fromCamera = function() {
        $cordovaCamera.getPicture({
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          saveToPhotoAlbum: false
        })
        .then(function(image) {
          $scope.uploadPhoto(image);
        }, function(error) {
          $cordovaToast.show(error, 'short', 'top');
        });
      };

      $scope.uploadPhoto = function(file) {
        $scope.loading = true;
        var options = {
          headers: {'Authorization': window.localStorage['token']},
          fileKey: "passport",
          fileName: "photo.jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          params: {
            user: $scope.userid
          }
        };
        $cordovaFileTransfer.upload(
          encodeURI(ApiDomain + $scope.url),
          file,
          options)
        .then(function(data) {
          $scope.loading = false;
          var response = angular.fromJson(data.response);
          if(response.status == 'success'){
            $scope.file = response.file;
          }else{
            $cordovaDialogs.alert(angular.toJson(data), 'Error');
          }
          $cordovaCamera.cleanup();
        }, function(error) {
          $cordovaDialogs.alert(angular.toJson(error), 'Error');
          $scope.loading = false;
          $cordovaCamera.cleanup();
          $cordovaToast.show(error.code, 'short', 'top');
        }, function(progress) {
          // constant progress updates
        });
      };
    }
  };
}])

.directive('chooseImages', [function() {
  return {
    restrict: 'E',
    scope: {
      files: '=',
      url: '@'
    },
    templateUrl: 'templates/tpl/choose-images.html',
    controller: function($rootScope, $scope, $timeout, $ionicActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaActionSheet, $cordovaCamera, $cordovaToast) {
      $scope.Domain = $rootScope.Domain;

      $scope.images = [];

      $scope.selectPhoto = function() {

        try {
          $cordovaActionSheet.show({
            title: lngTranslate('action_choose_photo_title'),
            buttonLabels: [lngTranslate('camera'),lngTranslate('gallery')],
            addCancelButtonWithLabel: lngTranslate('cancel'),
            androidEnableCancelButton : true,
            winphoneEnableCancelButton : true
          })
          .then(function(btnIndex) {
            switch (btnIndex) {
              case 1:
                $scope.fromCamera();
                break;
              case 2:
                $scope.fromGallery();
                break;
              defaut:
                break;
            }
          });
        } catch (error) {
          $ionicActionSheet.show({
            buttons: [{
              text: '<i class="icon ion-camera"></i> Камера'
            }, {
              text: '<i class="icon ion-images"></i> Галерея'
            }],
            buttonClicked: function(index) {
              switch (index) {
                case 0:
                  $scope.fromCamera();
                  break;
                case 1:
                  $scope.fromGallery();
                  break;
                  defaut:
                    break;
              }
              return true;
            }
          });
        }

      };

      $scope.fromGallery = function() {
        $cordovaImagePicker.getPictures({
          maximumImagesCount: 10
        })
        .then(function(files) {
          for (var i = 0; i < files.length; i++) {
            $scope.images.push({src: '', loading: true});
            $scope.uploadPhoto(files[i],$scope.images.length - 1);
          }
        }, function(error) {
          $cordovaToast.show(error, 'short', 'top');
        });
      };

      $scope.fromCamera = function() {
        $cordovaCamera.getPicture({
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          saveToPhotoAlbum: false
        })
        .then(function(image) {
          $scope.images.push({src: '', loading: true});
          $scope.uploadPhoto(image,$scope.images.length - 1);
        }, function(error) {
          $cordovaToast.show(error, 'short', 'top');
        });
      };

      $scope.uploadPhoto = function(file, i) {
        var options = {
          headers: {'Authorization': window.localStorage['token']},
          fileKey: "file",
          fileName: "photo.jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          params: {}
        };
        $cordovaFileTransfer.upload(
          encodeURI(ApiDomain + $scope.url),
          file,
          options)
        .then(function(data) {
          var src = angular.fromJson(data.response);
          $scope.images[i].src = src[0];
          $scope.images[i].loading = false;
          $scope.files.push($scope.images[i].src);
          $scope.$apply();
          $cordovaCamera.cleanup();
        }, function(error) {
          $scope.loading = false;
          $cordovaCamera.cleanup();
          $cordovaToast.show(error.code, 'short', 'top');
        }, function(progress) {
          // constant progress updates
        });
      };
    }
  };
}]);
