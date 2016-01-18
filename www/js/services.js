var ApiDomain = 'http://tax-free-dev.jaya-test.com/app_dev.php/';

angular.module('app.services', ['ngResource'])

.service('Catalog', function($rootScope, $q, $http){
  var self = {
    loadCountries: function() {
      window.SpinnerPlugin.activityStart("Loading...");
      $http.get(ApiDomain + 'api/catalog/country')
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 200){
          window.localStorage['countries'] = angular.toJson(data);
          $rootScope.countries = data;
        }else{
          console.error({status: status, data: data});
        }
      })
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          console.error({status: status, data: data});
        }
      });
    },
    loadTransports: function(){
      window.SpinnerPlugin.activityStart("Loading...");
      $http.get(ApiDomain + 'api/catalog/transport')
      .success(function(data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 200){
          window.localStorage['transports'] = angular.toJson(data);
          $rootScope.transports = data;
        }else{
          console.error({status: status, data: data});
        }
      })
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        if(status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          console.error({status: status, data: data});
        }
      });
    }
  };
  return self;
})

.service('AuthService', function($rootScope, $q, $state, $http) {
  var self  = {
    login: function(user) {

      window.SpinnerPlugin.activityStart("Авторизация...");
      $http({
        method: 'POST',
        url: ApiDomain + 'oauth/v2/token',
        data: $rootScope.serialize({
          client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
          client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk',
          grant_type: 'password',
          username: user.username,
          password: user.password
        }),
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
          $rootScope.$broadcast('auth-login');
        }else{
          $rootScope.$broadcast('auth-login-failed', data);
        }
      })
      .error(function (data, status, headers, config) {
        window.SpinnerPlugin.activityStop();
        $rootScope.$broadcast('auth-login-failed', data);
      });

    },

    logout: function() {
      window.localStorage.removeItem('token');
      delete $http.defaults.headers.common['Authorization'];
      $rootScope.$broadcast('auth-logout');
      console.log('AuthenticationService logout!');
    },

    refresh: function(){

      if(window.localStorage['refresh_token']){
        window.SpinnerPlugin.activityStart("Авторизация...");
        $http({
          method: 'POST',
          url: ApiDomain + 'oauth/v2/token',
          data: $rootScope.serialize({
            client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
            client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk',
            grant_type: 'refresh_token',
            refresh_token: window.localStorage['refresh_token']
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
        })
        .success(function(data, status, headers, config) {
          window.SpinnerPlugin.activityStop();
          if(data.access_token && status === 200){
            window.localStorage['token'] = 'Bearer '+ data.access_token;
            window.localStorage['refresh_token'] = data.refresh_token;
            $http.defaults.headers.common['Authorization'] = window.localStorage['token'];
            $rootScope.$broadcast('auth-login');
          }else{
            $rootScope.$broadcast('auth-login-failed', data.error_description);
          }
        })
        .error(function (data, status, headers, config) {
          window.SpinnerPlugin.activityStop();
          $rootScope.$broadcast('auth-login-failed', status);
        });
      }else{
        $rootScope.$broadcast('auth-login-failed', 'Invalid refresh token');
      }

      $rootScope.$broadcast('auth-login');
    }

  };
  return self;
})

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
        url: ApiDomain + 'oauth/v2/token',
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
      window.SpinnerPlugin.activityStart("Loading...");
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + 'api/user/register/one',
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
      window.SpinnerPlugin.activityStart("Loading...");
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + 'api/user/register/two',
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
      window.SpinnerPlugin.activityStart("Loading...");
      var q = $q.defer();
      $http({
        method: 'POST',
        url: ApiDomain + 'api/user/register/tree',
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

.factory('User', function ($resource) {
  return $resource(ApiDomain + 'api/user/me', {}, {
    update: {
      method: 'PUT'
    }
  });
})

.service('UserService', function($rootScope, $q, User){
  var self = {
    profile: {},
    getProfile: function(){
      User.get({}, function(data){
        self.profile = new User(data);
      }, function(error){
        $rootScope.$broadcast('auth-login-required', error);
      });
    },
    updateProfile: function(profile){
      profile.$update().then(function(){
        window.plugins.toast.showWithOptions({
          message: "Профиль успешно обновлен!",
          duration: "short",
          position: "top"
        });
      },function(error){
        if(error.status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          window.plugins.toast.showWithOptions({
            message: error.data,
            duration: "short",
            position: "top"
          });
        }
      });
    }
  };
  self.getProfile();
  return self;
})

.factory('Trip', function($resource) {
  return $resource(ApiDomain + 'api/trip/:id', {id: '@id'},{
    update: {
      method: 'PUT'
    }
  });
})

.service('TripListService', function($rootScope, $q, Trip) {
  var self = {
    getList: function(){
      window.SpinnerPlugin.activityStart("Loading...");
      var q = $q.defer();
      Trip.get({id: 'list'}, function(data){
        window.SpinnerPlugin.activityStop();
        q.resolve(data.trips);
      }, function(error){
        window.SpinnerPlugin.activityStop();
        if(error.status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          q.reject(angular.toJson({status: error.status, data: error.data}));
          console.log(error.data);
        }
      });
      return q.promise;
    }
  };
  return self;
})

.service('TripService', function($rootScope, $q, Trip) {
  var self = {
    info: {},
    checks: {},
    getInfo: function(id){
      var q = $q.defer();
      window.SpinnerPlugin.activityStart("Loading...");
      Trip.get({id: id}, function(data){
        window.SpinnerPlugin.activityStop();
        self.info = new Trip(data);
        q.resolve();
      }, function(error){
        window.SpinnerPlugin.activityStop();
        if(error.status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          q.reject(angular.toJson({status: error.status, data: error.data}));
          console.log(error.data);
        }
      });
      return q.promise;
    },
    updateInfo: function(trip){
      trip.$update({id: trip.id}).then(function(){
        window.plugins.toast.showWithOptions({
          message: "Trip updated!",
          duration: "short",
          position: "top"
        });
      },function(error){
        if(error.status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          console.log(error.data);
        }
      });
    },
    create: function(data){
      var q = $q.defer();
      var trip = new Trip(data);
      trip.$save({id: 'add'}).then(function(data){
        q.resolve(data);
        window.plugins.toast.showWithOptions({
          message: "Trip created!",
          duration: "short",
          position: "top"
        });
      },function(error){
        if(error.status == 401){
          $rootScope.$broadcast('auth-login-required', error);
        }else{
          q.reject(angular.toJson({status: error.status, data: error.data}));
          window.plugins.toast.showWithOptions({
            message: error.data,
            duration: "short",
            position: "top"
          });
        }
      });
      return q.promise;
    }
  };
  return self;
})

.factory('Check', function($resource) {
  return $resource('http://localhost:5000/checks/:id/', {
    id: '@id'
  },{
    update: {
      method: 'PUT'
    }
  });
})

.factory('CheckService', function($resource) {
  var checks = [{
    id: 0,
    title: "Gucci",
    time: '2015-11-04T22:00:00.000Z',
    status: "approved",
    images: [
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      },
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      },
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      }
    ]
  },{
    id: 1,
    title: "Nissan",
    time: '2015-11-04T22:00:00.000Z',
    status: "processed",
    images: [
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      }
    ]
  },{
    id: 2,
    title: "Elitparfums",
    time: '2015-11-04T22:00:00.000Z',
    status: "refused",
    images: []
  }];

  var self = {
    getList: function(){
      return checks;
    },
    getOne: function(id){
      return checks[id];
    }
  };

  return self;

})

.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      return q.promise;
    }
  }
}])

;
