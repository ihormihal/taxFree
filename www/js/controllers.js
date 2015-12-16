angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/signin.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
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

  //FILE UPLOADING
  // $scope.$watch('data.file', function () {
  //   if ($scope.data.file != null) {
  //     $scope.upload($scope.data.file);
  //   }
  // });

  // $scope.upload = function(file) {
  //   file.upload = Upload.upload({
  //     url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
  //     data: {file: file}
  //   });
  //   file.upload.then(function (response) {
  //     $timeout(function () {
  //       file.result = response.data;
  //     });
  //   }, function (response) {
  //     if (response.status > 0){
  //       $scope.errorMsg = response.status + ': ' + response.data;
  //     }
  //   }, function (evt) {
  //     //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
  //   });
  // };


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
  $scope.data = {};
  console.log($stateParams.id);
  $scope.id = $stateParams.id;
  $scope.data = Trips.get($scope.id);
})
//cordova plugin add cordova-plugin-file-transfer
//cordova plugin add com-sarriaroman-photoviewer
.controller('profileMainCtrl', function($scope, $timeout, $cordovaImagePicker, $cordovaFileTransfer, $ionicActionSheet, ProfileService, Camera) {
  $scope.user = ProfileService.profile;
  $scope.data = {};


  $scope.viewImage = function(url){
    PhotoViewer.show(url, 'Photo');
  };

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
      $scope.user.photo = result.response;
    },function(error) {
      $scope.data.loading = false;
      alert("ERROR: " + JSON.stringify(error))
    },function (progress) {
      // constant progress updates
    });
  }

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
    var upload_options = {
      fileKey: "file",
      fileName: "photo.jpg",
      chunkedMode: false,
      mimeType: "image/jpeg"
    };
    $cordovaImagePicker.getPictures(options)
    .then(function(results) {
      for (var i = 0; i < results.length; i++) {
        $scope.uploadPhoto(results[i]);
      }
    },function(error) {
      alert(error);
    });
  };

  $scope.fromCamera = function() {
    var options = {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
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

})

.controller('profilePasswordCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
})

.controller('profilePassCtrl', function($scope, ProfileService) {
  $scope.user = ProfileService.profile;
});
