angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])


.run(function($rootScope, $ionicPlatform, $ionicPopup, $cordovaNetwork) {

  $ionicPlatform.ready(function() {

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

  $rootScope.serialize = function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          $rootScope.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  };


})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider) {

  if(window.localStorage['token']){
    $httpProvider.defaults.headers.common['Authorization'] = window.localStorage['token'];
  }

  $resourceProvider.defaults.stripTrailingSlashes = false;

})

.filter('translate', function() {
  return function(text, def) {
    var lang = 'ru';
    if(window.localStorage['lang']) {
      lang = window.localStorage['lang'];
    }
    if(text in translate[lang]) {
      return translate[lang][text];
    }else{
      return text;
    }
  }
})