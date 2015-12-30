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
      $element[0].onclick = function(e) {
        PhotoViewer.show($attrs.src, $attrs.alt);
      };
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
    controller: function($scope, $timeout, $ionicActionSheet, $cordovaImagePicker, $cordovaFileTransfer, Camera) {
      $scope.loading = false;
      $scope.selectPhoto = function() {
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
      };

      $scope.fromGallery = function() {
        var options = {
          maximumImagesCount: 1
        };
        $cordovaImagePicker.getPictures(options)
          .then(function(images) {
            for (var i = 0; i < images.length; i++) {
              $scope.uploadPhoto(images[i]);
            }
          }, function(error) {
            alert(error);
          });
      };

      $scope.fromCamera = function() {
        var options = {
          saveToPhotoAlbum: false
        };
        Camera.getPicture(options)
          .then(function(image) {
            $scope.uploadPhoto(image);
          }, function(error) {
            alert(error);
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
            encodeURI("http://tax-free.jaya-test.com/app_dev.php/api/user/upload"),
            file,
            options)
          .then(function(result) {
            $scope.loading = false;
            $scope.image = result.response + '?' + new Date().getTime();
          }, function(error) {
            $scope.loading = false;
            alert("An error has occurred: Code = " + error.code);
          }, function(progress) {
            // constant progress updates
          });
      };
    }
  };
}]);
