var ApiDomain = 'http://tax-free-dev.jaya-test.com/app_dev.php';

var Credentials = {
  client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
  client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk'
}

angular.module('app', ['ionic', 'ngCordova', 'app.cordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])


.run(function($rootScope, $state, $ionicPlatform, $ionicPopup, $cordovaNetwork, AuthService, Toast, Alert) {

  $ionicPlatform.ready(function() {

    $rootScope.Domain = 'http://tax-free-dev.jaya-test.com/';

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      if(offlineState){
        $ionicPopup.alert({
          title: lngTranslate('no_internet'),
          content: lngTranslate('no_internet_message'),
        }).then(function() {
          ionic.Platform.exitApp();
        });
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.localStorage['token']){
      //$state.go('main.user.profile');
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

  $rootScope.getById = function(items,id){
    if(!Array.isArray(items)) return id;
    for(var i = 0; i < items.length; i++){
      if(items[i].id == id){
        return items[i];
        break;
      }
    }
  };

  $rootScope.$on('http-error', function(event, data) {
    window.SpinnerPlugin.activityStop();
    if(data.status == 401){
      AuthService.refresh();
    }else{
      var message = '';
      var isMessage= false;
      if(data.data){
        if(data.data.error){
          if(data.data.error.message){
            message = data.data.error.message + '. ';
            isMessage = true;
          }
          if(data.data.error.message){
            message += 'Error code: '+data.data.error.code;
            isMessage = true;
          }
          if(data.data.error_description){
            message += data.data.error_description + '. ';
            isMessage = true;
          }
        }
      }
      isMessage= false;
      if(isMessage){
        Alert.show({message: message, title: 'Error'});
      }else{
        Alert.show({message: angular.toJson(data), title: 'Error'});
      }
    }
    return false;
  });

  $rootScope.$on('auth-login-success', function(event, data) {
    $state.go('main.user.profile');
  });

  $rootScope.$on('auth-login-error', function(event, data) {
    Toast.show(data);
    $state.go('login');
  });

  $rootScope.$on('auth-logout', function(event, data) {
    $state.go('login');
  });


  if(!window.SpinnerPlugin){
    window.SpinnerPlugin = {
      activityStart: function(message){
        console.log(message);
      },
      activityStop: function(){
        console.log('spinner stop');
      }
    };
  }

  if(!window.plugins){
    window.plugins = {};
  }

  if(!window.plugins.toast){
    window.plugins.toast = {
      showWithOptions: function(options,success,error){
        console.log(options.message);
      }
    };
  }


})

.config(function($httpProvider, $resourceProvider) {

  if(window.localStorage['token']){
    $httpProvider.defaults.headers.common['Authorization'] = window.localStorage['token'];
  }
  $resourceProvider.defaults.stripTrailingSlashes = false;

  //http error processing
  $httpProvider.interceptors.push(function($rootScope, $q) {
    return {
      responseError: function(error) {
        var q = $q.defer();
        $rootScope.$broadcast('http-error', error);
        q.reject(error);
        return q.promise;
      }
    };
  });


})

;

if(!window.localStorage['lang']){
  window.localStorage['lang'] = 'ru';
}
var lngTranslate = function(text){
  if(window.localStorage['lang']) {
    lang = window.localStorage['lang'];
  }else{
    lang = 'ru';
  }
  if(text in translate[lang]) {
    return translate[lang][text];
  }else{
    return text;
  }
};