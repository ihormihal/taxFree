angular.module('app.directives', [])


.directive('input', ['dateFilter', function(dateFilter) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function($scope, $element, $attrs, ngModel) {
      if (typeof $attrs.type !== 'undefined' && $attrs.type === 'date' && ngModel) {
        ngModel.$formatters.push(function(value) {
          return new Date(value * 1000);
        });
        ngModel.$parsers.push(function(value) {
          return value.getTime() / 1000;
        });
      }
    }
  }
}])

.directive('integerModel', [function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element, $attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        if(value !== undefined){
          return value.toString();
        }
      });
      ngModel.$parsers.push(function(value) {
        if(value !== undefined){
          return parseInt(value);
        }
      });
    }
  }
}])


.directive('imageViewer', [function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      $element[0].onclick = function () {
        PhotoViewer.show($attrs.src, $attrs.alt);
      }
    }
  }
}])

.directive('chooseImage', [function() {
  return {
    restrict: 'E',
    scope: {
      image: '='
    },
    templateUrl: 'templates/tpl/choose-image.html',
    controller: function($scope, $timeout, $ionicActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaActionSheet, $cordovaCamera, $cordovaToast) {
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
          fileKey: "file",
          fileName: "photo.jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          params: {
            userid: 10
          }
        };
        $cordovaFileTransfer.upload(
          encodeURI("http://tax-free-dev.jaya-test.com/app_dev.php/api/user/upload"),
          file,
          options)
        .then(function(result) {
          $scope.loading = false;
          $scope.image = result.response + '?' + new Date().getTime();
          $cordovaCamera.cleanup();
        }, function(error) {
          $scope.loading = false;
          cordovaCamera.cleanup();
          $cordovaToast.show(error.code, 'short', 'top');
        }, function(progress) {
          // constant progress updates
        });
      };
    }
  };
}]);
