// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])


.run(function($rootScope, $ionicPlatform, $ionicPopup, $cordovaNetwork) {

  $ionicPlatform.ready(function() {

    //var isOffline = $cordovaNetwork.isOffline()
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      if(offlineState){
        $ionicPopup.alert({
          title: "Нет интернета!",
          content: "Ваше устройство не подключено к интернету"
        }).then(function() {
          ionic.Platform.exitApp();
        });
      }
    })
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });//ionic ready end

  // $httpBackend.whenGET('https://posts')
  // .respond(function(method, url, data, headers) {
  //   var authToken = localStorageService.get('authorizationToken');
  //   return authToken ? [200, posts] : [401];
  // });

  // $httpBackend.whenPOST('http://localhost:5000/login')
  // .respond(function(method, url, data) {
  //   var authToken = 'NjMw ...';
  //   return [200, {
  //     authorizationToken: authToken
  //   }];
  // });

  // $httpBackend.whenPOST('http://localhost:5000/logout')
  // .respond(function(method, url, data) {
  //   return [200];
  // });

  // $httpBackend.whenGET(/.*/).passThrough();


})