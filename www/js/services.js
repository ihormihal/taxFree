angular.module('app.services', ['ngResource'])

/****************************************/
/************ CATALOG SERVICE ***********/
/****************************************/

.factory('Catalog', function($resource) {
  return $resource(ApiDomain + '/api/catalog/:name', {name: '@name'});
})

/****************************************/
/******* AUTHENTIFICATION SERVICE *******/
/****************************************/

.service('AuthService', function($rootScope, $q, $http) {
  var self = {
    query: function(credentials){
      window.SpinnerPlugin.activityStart(lngTranslate('authorization')+'...');
      $http({
        method: 'POST',
        url: ApiDomain + '/oauth/v2/token',
        data: $rootScope.serialize(credentials),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(data.access_token && status == 200){
          window.localStorage['token'] = 'Bearer '+ data.access_token;
          window.localStorage['refresh_token'] = data.refresh_token;
          $http.defaults.headers.common['Authorization'] = window.localStorage['token'];
          $rootScope.$broadcast('auth-login-success');
          return false;
        }else{
          $rootScope.$broadcast('auth-login-error', data);
          return false;
        }
      })
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        $rootScope.$broadcast('auth-login-error', data);
        return false;
      });
    },

    login: function(user) {
      Credentials.grant_type = 'password';
      Credentials.username = user.username;
      Credentials.password = user.password;
      self.query(Credentials);
    },

    refresh: function(){
      if(window.localStorage['refresh_token']){
        Credentials.grant_type = 'refresh_token';
        Credentials.refresh_token = window.localStorage['refresh_token'];
        self.query(Credentials);
      }else{
        $rootScope.$broadcast('auth-login-error', {error:'empty_refresh_token'});
        return false;
      }
    },

    logout: function() {
      window.localStorage.removeItem('token');
      delete $http.defaults.headers.common['Authorization'];
      $rootScope.$broadcast('auth-logout');
      return false;
    }

  };
  return self;
})

/****************************************/
/********* REGISTRATION SERVICE *********/
/****************************************/

.service('RegService', function($rootScope, $q, $state, $http) {
  var self = {
    data: {
      email: 'ihor.mihal@gmail.com',
      phone: '0734058015',
      confirmation: 'email',
      country: 1
    },

    getToken: function(){
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + '/oauth/v2/token',
        data: $rootScope.serialize({
          grant_type: 'client_credentials',
          client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
          client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk'
        }),
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
      })
      .error(function (data, status, headers, config) {
        q.reject(angular.toJson({status: status, data: data}));
      });
      return q.promise;
    },

    one: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('loading'));
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + '/api/user/register/one',
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
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        q.reject(angular.toJson({status: status, data: data}));
      });
      return q.promise;
    },

    two: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('loading'));
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + '/api/user/register/two',
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
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        q.reject(angular.toJson({status: status, data: data}));
      });
      return q.promise;
    },

    tree: function(){
      window.SpinnerPlugin.activityStart(lngTranslate('loading'));
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + '/api/user/register/tree',
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
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        q.reject(angular.toJson({status: status, data: data}));
      });
      return q.promise;
    }
  };
  return self;
})

/****************************************/
/************* USER SERVICE *************/
/****************************************/

.factory('User', function ($resource) {
  return $resource(ApiDomain + '/api/user/me', {}, {
    update: {
      method: 'PUT'
    }
  });
})

/****************************************/
/************* TRIP SERVICE *************/
/****************************************/

.factory('Trips', function($resource) {
  return $resource(ApiDomain + '/api/trip/list');
})

.factory('Trip', function($resource) {
  return $resource(ApiDomain + '/api/trip/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  });
})

/****************************************/
/************* CHECK SERVICE ************/
/****************************************/

.factory('Checks', function($resource) {
  return $resource(ApiDomain + '/api/check/list');
})

.factory('Check', function($resource) {
  return $resource(ApiDomain + '/api/check/:id', {id: '@id'},{
    update: {
      method: 'PUT'
    }
  });
})

/****************************************/
/********** DECLARATION SERVICE *********/
/****************************************/

.factory('declarationService', function($resource) {
  var declarations = [{
    id: 0,
    name: "Иван Иваннон",
    country: 1,
    date: '1453138173',
    time: '7200',
    status: "approved",
    checks: [
      {
        id: 372,
        items: [{
          title: 'iPhone 5S',
          price: 350
        },{
          id: 479,
          title: 'iPhone 6',
          price: 550
        }]
      },
      {
        id: 479,
        items: [{
          title: 'iPhone 5S',
          price: 350
        },{
          id: 479,
          title: 'iPhone 6',
          price: 550
        }]
      }
    ],
    summ: 900,
    summ_nds: 120,
    to_pay: 100
  },{
    id: 1,
    name: "Иван Иваннон",
    country: 2,
    date: '1453138173',
    time: '7200',
    status: "refused",
    checks: [
      {
        id: 372,
        items: [{
          title: 'iPhone 5S',
          price: 350
        },{
          id: 479,
          title: 'iPhone 6',
          price: 550
        }]
      },
      {
        id: 479,
        items: [{
          title: 'iPhone 5S',
          price: 350
        },{
          id: 479,
          title: 'iPhone 6',
          price: 550
        }]
      }
    ],
    summ: 900,
    summ_nds: 120,
    to_pay: 100
  }];

  var self = {
    getList: function(){
      return declarations;
    },
    getOne: function(id){
      return declarations[id];
    }
  };

  return self;

})

;
