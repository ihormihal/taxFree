angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('signinCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = {
    email: 'example@mail.com',
    password: '0000'
  };

  $scope.signin = function() {
    LoginService.signin($scope.data.email, $scope.data.password)
    .then(function(data) {
      $state.go('main.profile.main');
    },function(error) {
      $ionicPopup.alert({
        title: 'Login failed!',
        template: err
      });
    });
  };
})

.controller('signupCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = LoginService.data;

  $scope.signup = function() {
    LoginService.signup($scope.data.email, $scope.data.phone, $scope.data.type)
    .then(function(data) {
      console.log($scope.data.type);
      $state.go('signupConformation');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
  $scope.confirm = function() {
    LoginService.confirm($scope.data.code)
    .then(function(data) {
      $state.go('reg');
    }).error(function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
})

.controller('regCtrl', function($scope, $state, $timeout, $ionicPopup, ProfileService, Upload) {
  $scope.data = {};

  $scope.save = function() {
    ProfileService.save($scope.data)
    .then(function(data) {
      $state.go('main.profile.main');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  }
})

.controller('passwordRecoveryCtrl', function($scope, $state, $ionicPopup, LoginService) {
  $scope.data = LoginService.data;

  $scope.send = function() {
    LoginService.passwordRecovery($scope.data.email, $scope.data.phone, $scope.data.type)
    .then(function(data) {
      $state.go('passwordRecoveryConformation');
    },function(data) {
      $ionicPopup.alert({
        title: 'Error!',
        template: data
      });
    });
  };

  $scope.confirm = function() {
    LoginService.confirm($scope.data.code)
    .then(function(data) {
      $state.go('passwordReset');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };

  $scope.restore = function() {
    LoginService.passwordRestore($scope.data.password)
    .then(function(data) {
      $state.go('signin');
    },function(error) {
      $ionicPopup.alert({
        title: 'Error!',
        template: error
      });
    });
  };
})

.controller('helpCtrl', function($scope) {

})

.controller('tripsCtrl', function($scope, Trips) {
  $scope.trips = Trips.all();
})

.controller('tripCtrl', function($scope, $stateParams, Trips) {
  $scope.data = Trips.get($stateParams.id);
})
//cordova plugin add cordova-plugin-file-transfer
//cordova plugin add com-sarriaroman-photoviewer
//cordova plugin add cordova-plugin-imagepicker
.controller('profileMainCtrl', function($scope, $timeout, $cordovaFileTransfer, $ionicActionSheet, ProfileService, Camera) {
  $scope.user = ProfileService.profile;
  $scope.data = {};

  $scope.viewImage = function(url){
    PhotoViewer.show(url, 'Photo');
  };

  $scope.selectPhoto = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: '<i class="icon ion-camera"></i> Камера'
      }, {
        text: '<i class="icon ion-images"></i> Галерея'
      }],
      buttonClicked: function(index) {
        switch (index){
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

  $scope.fromGallery = function(){
    var options = {
      maximumImagesCount: 5,
      width: 800,
      height: 800,
      quality: 80
    };
    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          $scope.uploadPhoto(results[i]);
        }
      }, function (error) {
        alert(error);
      }, options
    );
  };

  $scope.fromCamera = function() {
    var options = {
      targetWidth: 800,
      targetHeight: 800,
      quality: 80,
      saveToPhotoAlbum: false
    };
    Camera.getPicture(options)
    .then(function(temp_path) {
      //upload this to server
      $scope.uploadPhoto(temp_path);
    },function(error) {
      alert(error);
    });
  };

  $scope.data.loading = false;

  // $scope.uploadPhoto = function(file){
  //   $scope.data.loading = true;
  //   var options = new FileUploadOptions();
  //   options.fileKey = "file";
  //   //options.fileName = fileURL.substr(file.lastIndexOf('/') + 1);
  //   options.fileName = "photo.jpg";
  //   options.mimeType = "image/jpeg";
  //   options.params = {userid: 10};
  //   options.headers = {'headerParam':'headerValue'};
  //   options.chunkedMode = false;

  //   var ft = new FileTransfer();
  //   ft.onprogress = function(progressEvent) {
  //     /*if (progressEvent.lengthComputable) {
  //       loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
  //     } else {
  //       loadingStatus.increment();
  //     }*/
  //   };
  //   ft.upload(
  //     file,
  //     encodeURI("http://mycode.in.ua/test/upload_file.php"),
  //     function(result) {
  //       $scope.data.loading = false;
  //       //console.log("Code = " + result.responseCode);
  //       //console.log("Response = " + result.response);
  //       //console.log("Sent = " + result.bytesSent);
  //       $scope.user.photo = result.response + '?' + new Date().getTime();
  //       alert($scope.user.photo);
  //     },function(error) {
  //       $scope.data.loading = false;
  //       alert("An error has occurred: Code = " + error.code);
  //       //console.log("upload error source " + error.source);
  //       //console.log("upload error target " + error.target);
  //     },
  //     options
  //   );
  // };

  $scope.uploadPhoto = function(file){
    $scope.data.loading = true;
    var options = {
      fileKey: "file",
      fileName: "photo.jpg",
      chunkedMode: false,
      mimeType: "image/jpeg"
    };
    $cordovaFileTransfer.upload("http://mycode.in.ua/test/upload_file.php", file, options)
    .then(function(result) {
      $scope.data.loading = false;
      $scope.user.photo = result.response + '?' + new Date().getTime();
    },function(error) {
      $scope.data.loading = false;
     alert("An error has occurred: Code = " + error.code);
    },function (progress) {
      // constant progress updates
    });
  };

})

.controller('profilePasswordCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profilePassCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
});
