angular.module('app.config', ['ngResource'])

.config(function($httpProvider, $resourceProvider) {
  if (window.localStorage['token']) {
    $httpProvider.defaults.headers.common['Authorization'] = window.localStorage['token'];
  }
  $resourceProvider.defaults.stripTrailingSlashes = false;
  $httpProvider.interceptors.push('httpInterceptor');
})


.factory('httpInterceptor', function($q, $rootScope) {
  return {
    // 'response': function(response) {

    // },
    //http error processing
    responseError: function(error) {
      var q = $q.defer();
      $rootScope.$broadcast('http-error', error);
      q.reject(error);
      return q.promise;
    }
  };
})

.service('AppConfig', function($rootScope, $state, $ionicHistory) {

   $rootScope.config = {
    domain: 'http://stage.tax-free-4u.com/', //default
    domains: {
      public: 'http://tax-free-4u.com/',
      stage: 'http://stage.tax-free-4u.com/',
      test: 'http://tax-free-4u.com/',
      dev: 'http://tax-free-dev.jaya-test.com/'
    },
    credentials: {
      client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
      client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk'
    },
    debug: false
  };

  if(window.localStorage['config']){
    $rootScope.config = angular.fromJson(window.localStorage['config']);
  }

  $rootScope.transports = [];
  $rootScope.countries = [];
  $rootScope.trips = [];

  $rootScope.getById = function(items, id) {
    if (!Array.isArray(items)) return id;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id == id) {
        return items[i];
        break;
      }
    }
  };

  $rootScope.checkTransports = function(){
    if($rootScope.transports.length === 0){
      Toast.show(lngTranslate('catalog_transports_loading'));
    }
  };
  $rootScope.checkCountries = function(){
    if($rootScope.countries.length === 0){
      Toast.show(lngTranslate('catalog_countries_loading'));
    }
  };

  //data object
  $rootScope.currentDate = function(){
    return new Date();
  };
  //in seconds
  $rootScope.currentTime = function(){
    return parseInt(new Date().getTime()/1000);
  };

  $rootScope.goToScreen = function(data){

    switch(data.entity){
      case 'profile':
        $state.go('main.profile');
        break;
      case 'trip':
        if(data.entity_id){
          $state.go('main.trip',{id: data.entity_id});
        }else{
          $state.go('main.trips');
        }
        break;
      case 'check':
        if(data.entity_id){
          $state.go('main.check',{id: data.entity_id});
        }else{
          $state.go('main.checks');
        }
        break;
      case 'declaration':
        if(data.entity_id){
          $state.go('main.declaration',{id: data.entity_id});
        }else{
          $state.go('main.declarations');
        }
        break;
      case 'card':
        if(data.entity_id){
          $state.go('main.card',{id: data.entity_id});
        }else{
          $state.go('main.cards');
        }
        break;
      default:
        console.log([data.entity, data.entity_id]);
        break;
    }

  };


  if (!window.SpinnerPlugin) {
    window.SpinnerPlugin = {
      activityStart: function(message) {
        console.log(message);
      },
      activityStop: function() {
        console.log('spinner stop');
      }
    };
  }

});
