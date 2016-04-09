angular.module('app.services', ['ngResource'])

/****************************************/
/******* AUTHENTIFICATION SERVICE *******/
/****************************************/

.service('AuthService', function($rootScope, $q, $state, $http, $cordovaFile, Toast) {

  var self = {

    credentials: {
      username: null,
      password: null,
      grant_type: null,
      refresh_token: null,
      client_id: $rootScope.config.credentials.client_id,
      client_secret: $rootScope.config.credentials.client_secret
    },

    query: function(){
      console.log('query');
      window.SpinnerPlugin.activityStart(lngTranslate('authorization')+'...');
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'oauth/v2/token',
        data: serializeData(self.credentials),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(data.access_token && status == 200){

          if(self.credentials.username){
            window.localStorage['username'] = self.credentials.username;
          }
          if(self.credentials.password){
            window.localStorage['password'] = self.credentials.password;
          }

          var token = 'Bearer '+ data.access_token;
          self.credentials.refresh_token = data.refresh_token;

          $http.defaults.headers.common['Authorization'] = token;

          window.localStorage['token'] = token;
          window.localStorage['refresh_token'] = self.credentials.refresh_token;

          if(self.credentials.grant_type == 'password'){
            $rootScope.$broadcast('auth-login-success');
          }

          $rootScope.httpWaiting = false;

          return false;
        }
      })
      .error(function (data, status, headers, config) {
        $rootScope.httpWaiting = false;
        if(self.credentials.grant_type == 'password'){
          $rootScope.$broadcast('auth-login-error', data);
        }
        return false; //do not intercept error
      });
    },

    login: function() {
      console.log('login');
      self.credentials.grant_type = 'password';
      self.query();
    },

    refresh: function(){
      self.credentials.grant_type = 'refresh_token';
      if(self.credentials.refresh_token){
        self.query();
      }
      if(window.localStorage['refresh_token']){
        self.credentials.refresh_token = window.localStorage['refresh_token'];
        self.query();
      }else{
        $rootScope.$broadcast('auth-login-error', {error:'empty_refresh_token'});
        return false;
      }
    },

    logout: function() {
      self.credentials.password = null;
      self.credentials.refresh_token = null;
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('refresh_token');
      window.localStorage.removeItem('password');
      delete $http.defaults.headers.common['Authorization'];

      try {
        $cordovaFile.removeRecursively(cordova.file.cacheDirectory, "");
      } catch (error) {
        console.log(error);
      }
      $state.go('login');
      return false;
    }

  };

  if(window.localStorage['username']){
    self.credentials.username = window.localStorage['username'];
  }
  if(window.localStorage['password']){
    self.credentials.password = window.localStorage['password'];
  }

  return self;
})

/****************************************/
/********* REGISTRATION SERVICE *********/
/****************************************/

.service('RegService', function($rootScope, $q, $state, $http, AuthService) {
  var self = {
    data: {
      email: '',
      phone: '',
      confirmation: 'sms',
      password: '',
      password_confirm: '',
      accept_terms: false
    },

    getToken: function(){
      AuthService.credentials.grant_type = 'client_credentials';
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'oauth/v2/token',
        data: serializeData(AuthService.credentials),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(data.access_token && status == 200){
          window.localStorage['token'] = 'Bearer '+ data.access_token;
          $http.defaults.headers.common['Authorization'] = window.localStorage['token'];
          q.resolve(data);
        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      });
      return q.promise;
    },

    one: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('loading'));
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'api/user/register/one',
        data: serializeData(self.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 200){
          q.resolve(data);
        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      })
      return q.promise;
    },

    two: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('loading'));
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'api/user/register/two',
        data: serializeData(self.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 200){
          q.resolve(data);
        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      });
      return q.promise;
    },

    three: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('loading'));
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'api/user/register/three',
        data: serializeData(self.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 200){
          q.resolve(data);
        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      });
      return q.promise;
    }
  };
  return self;
})

/****************************************/
/********** PASSWORDS SERVICE ***********/
/****************************************/
.service('PasswordService', function($rootScope, $q, $state, $http) {

  var self = {

    data: {
      sendTo: 'sms',
      contact: '',
      password: '',
      password_confirm: ''
    },

    one: function(){
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'api/user/resetpassword',
        data: serializeData(self.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        if(status == 200){
          q.resolve(data);

        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      });
      return q.promise;
    },

    two: function(){
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'api/user/resetpassword/confirm',
        data: serializeData(self.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        if(status == 200){
          q.resolve(data);
        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      });
      return q.promise;
    },

    three: function(){
      var q = $q.defer();
      $http({
        method: 'POST',
        url: $rootScope.config.domain + 'api/user/setpassword/token',
        data: serializeData(self.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        if(status == 200){
          q.resolve(data);
        }else{
          q.reject(angular.toJson({status: status, data: data}));
        }
      });
      return q.promise;
    }
  };

  return self;

})

/****************************************/
/************ CATALOG SERVICE ***********/
/****************************************/

.factory('Catalog', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/catalog/:name', {name: '@name'});
})


/****************************************/
/****** APP PRIVATE DATA SERVICES *******/
/****************************************/

/****************************************/
/********** DASHBOARD SERVICE ***********/
/****************************************/

.factory('Dashboard', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/dashboard/:request', {request: '@request'},{
    getActionList: {
      url: $rootScope.config.domain + 'api/dashboard/action/list',
      method: 'GET'
    },
    getPayments: {
      url: $rootScope.config.domain + 'api/dashboard/allpayments',
      method: 'GET'
    },
    getLastPayment: {
      url: $rootScope.config.domain +'api/dashboard/lastapprovedpayment',
      method: 'GET'
    },
    getNoactionList: {
      url: $rootScope.config.domain +'api/dashboard/noaction/list',
      method: 'GET'
    }
  });
})

/****************************************/
/************* USER SERVICE *************/
/****************************************/

.factory('User', function ($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/user/me', {}, {
    update: {
      method: 'PUT'
    }
  });
})

.factory('Settings', function ($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/user/settings', {}, {
    update: {
      method: 'PUT'
    },
    sendDeviceToken: {
      url: $rootScope.config.domain + 'api/user/send_identifier',
      method: 'POST'
    }
  });
})

/****************************************/
/************* TRIP SERVICE *************/
/****************************************/

.factory('Trips', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/trip/list');
})

.factory('Trip', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/trip/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    },
    add: {
      method: 'POST'
    }
  });
})

.factory('TripChecks', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/trip/:id/checks', {id: '@id'});
})

.factory('TripDeclarations', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/trip/:id/declarations', {id: '@id'});
})

/****************************************/
/************* CHECK SERVICE ************/
/****************************************/

.factory('Checks', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/check/list');
})

.factory('Check', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/check/:id', {id: '@id'},{
    update: {
      method: 'PUT'
    },
    add: {
      method: 'POST'
    }
  });
})

/****************************************/
/********** DECLARATION SERVICE *********/
/****************************************/

.factory('Declarations', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/declaration/list');
})

.factory('Declaration', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/declaration/:id', {id: '@id'},{
    update: {
      method: 'POST'
    }
  });
})

.factory('Payments', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/declaration/payments');
})

/****************************************/
/************* CARDS SERVICE ************/
/****************************************/

.factory('Cards', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/card/list');
})

.factory('Card', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/card/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    },
    add: {
      method: 'POST'
    },
    setDefault: {
      url: $rootScope.config.domain + 'api/card/:id/default',
      params: {id: '@id'},
      method: 'POST'
    }
  });
})

.factory('TaxFreeCard', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/taxfreecard/request/ctf', {}, {
    add: {
      method: 'POST'
    }
  });
})


/****************************************/
/************ MESSAGE SERVICE ***********/
/****************************************/

// .factory('Message', function($rootScope, $resource) {
//   return $resource($rootScope.config.domain + 'api/message/:action', {action: '@action'}, {
//     call : {
//       method: 'POST'
//     }
//   });
// })

.factory('Messages', function($rootScope, $resource) {
  return $resource($rootScope.config.domain + 'api/message/list');
})

;
