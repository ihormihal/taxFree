angular.module('app.services', ['ngResource'])

/****************************************/
/************ CATALOG SERVICE ***********/
/****************************************/

.factory('Catalog', function($resource) {
  return $resource(window.AppSettings.api + 'api/catalog/:name', {name: '@name'});
})

/****************************************/
/******* AUTHENTIFICATION SERVICE *******/
/****************************************/

.service('AuthService', function($rootScope, $q, $http, Toast) {

  var self = {

    credentials: {
      username: null,
      password: null,
      grant_type: null,
      client_id: window.Credentials.client_id,
      client_secret: window.Credentials.client_secret,
      refresh_token: null
    },

    query: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('authorization')+'...');
      $http({
        method: 'POST',
        url: window.AppSettings.api + 'oauth/v2/token',
        data: $rootScope.serialize(self.credentials),
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

          window.localStorage['token'] = 'Bearer '+ data.access_token;
          window.localStorage['refresh_token'] = data.refresh_token;
          self.credentials.refresh_token = data.refresh_token;

          $http.defaults.headers.common['Authorization'] = window.localStorage['token'];

          if(self.credentials.grant_type == 'password'){
            $rootScope.$broadcast('auth-login-success');
          }

          if(self.credentials.grant_type == 'refresh_token'){
            Toast.show(lngTranslate('error_general'));
          }

          return false;

        }else{
          $rootScope.$broadcast('auth-login-error', data);
          return false;
        }
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('auth-login-error', data);
        return false; //do not intercept error in app.js
      });
    },

    login: function() {
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
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('refresh_token');
      self.credentials.refresh_token = null;
      delete $http.defaults.headers.common['Authorization'];
      $rootScope.$broadcast('auth-logout');
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
        url: window.AppSettings.api + 'oauth/v2/token',
        data: $rootScope.serialize(AuthService.credentials),
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
        url: window.AppSettings.api + 'api/user/register/one',
        data: $rootScope.serialize(self.data),
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
        url: window.AppSettings.api + 'api/user/register/two',
        data: $rootScope.serialize(self.data),
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
        url: window.AppSettings.api + 'api/user/register/three',
        data: $rootScope.serialize(self.data),
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
        url: window.AppSettings.api + 'api/user/resetpassword',
        data: $rootScope.serialize(self.data),
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
        url: window.AppSettings.api + 'api/user/resetpassword/confirm',
        data: $rootScope.serialize(self.data),
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
        url: window.AppSettings.api + 'api/user/setpassword/token',
        data: $rootScope.serialize(self.data),
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
/****** APP PRIVATE DATA SERVICES *******/
/****************************************/

/****************************************/
/********** DASHBOARD SERVICE ***********/
/****************************************/

.factory('Dashboard', function($resource) {
  return $resource(window.AppSettings.api + 'api/dashboard/:request', {request: '@request'},{
    getActionList: {
      url: window.AppSettings.api + 'api/dashboard/action/list',
      method: 'GET'
    },
    getPayments: {
      url: window.AppSettings.api + 'api/dashboard/allpayments',
      method: 'GET'
    },
    getLastPayment: {
      url: window.AppSettings.api +'api/dashboard/lastapprovedpayment',
      method: 'GET'
    },
    getNoactionList: {
      url: window.AppSettings.api +'api/dashboard/noaction/list',
      method: 'GET'
    }
  });
})

/****************************************/
/************* USER SERVICE *************/
/****************************************/

.factory('User', function ($resource) {
  return $resource(window.AppSettings.api + 'api/user/me', {}, {
    update: {
      method: 'PUT'
    },
    sendDeviceToken: {
      url: window.AppSettings.api + 'api/user/send_identifier',
      method: 'POST'
    }
  });
})

.factory('Settings', function ($resource) {
  return $resource(window.AppSettings.api + 'api/user/settings', {}, {
    update: {
      method: 'PUT'
    }
  });
})

/****************************************/
/************* TRIP SERVICE *************/
/****************************************/

.factory('Trips', function($resource) {
  return $resource(window.AppSettings.api + 'api/trip/list');
})

.factory('Trip', function($resource) {
  return $resource(window.AppSettings.api + 'api/trip/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    },
    add: {
      method: 'POST'
    }
  });
})

.factory('TripChecks', function($resource) {
  return $resource(window.AppSettings.api + 'api/trip/:id/checks', {id: '@id'});
})

.factory('TripDeclarations', function($resource) {
  return $resource(window.AppSettings.api + 'api/trip/:id/declarations', {id: '@id'});
})

/****************************************/
/************* CHECK SERVICE ************/
/****************************************/

.factory('Checks', function($resource) {
  return $resource(window.AppSettings.api + 'api/check/list');
})

.factory('Check', function($resource) {
  return $resource(window.AppSettings.api + 'api/check/:id', {id: '@id'},{
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

.factory('Declarations', function($resource) {
  return $resource(window.AppSettings.api + 'api/declaration/list');
})

.factory('Declaration', function($resource) {
  return $resource(window.AppSettings.api + 'api/declaration/:id', {id: '@id'},{
    update: {
      method: 'POST'
    }
  });
})

.factory('Payments', function($resource) {
  return $resource(window.AppSettings.api + 'api/declaration/payments');
})

/****************************************/
/************* CARDS SERVICE ************/
/****************************************/

.factory('Cards', function($resource) {
  return $resource(window.AppSettings.api + 'api/card/list');
})

.factory('Card', function($resource) {
  return $resource(window.AppSettings.api + 'api/card/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    },
    add: {
      method: 'POST'
    },
    setDefault: {
      url: window.AppSettings.api + 'api/card/:id/default',
      params: {id: '@id'},
      method: 'POST'
    }
  });
})

.factory('TaxFreeCard', function($resource) {
  return $resource(window.AppSettings.api + 'api/taxfreecard/request/ctf', {}, {
    add: {
      method: 'POST'
    }
  });
})


/****************************************/
/************ MESSAGE SERVICE ***********/
/****************************************/

// .factory('Message', function($resource) {
//   return $resource(window.AppSettings.api + 'api/message/:action', {action: '@action'}, {
//     call : {
//       method: 'POST'
//     }
//   });
// })

.factory('Messages', function($resource) {
  return $resource(window.AppSettings.api + 'api/message/list');
})

;
