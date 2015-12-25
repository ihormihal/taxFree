angular.module('app.services', ['ngResource', 'LocalStorageModule', 'http-auth-interceptor'])

.factory('AuthenticationService', ['$rootScope', '$q', '$state', '$http', 'localStorageService', 'authService', function($rootScope, $q, $state, $http, localStorageService, authService) {
  var loggedIn = false;
  var self  = {
    login: function(credentials) {
      console.log(credentials);
      var q = $q.defer();
      $http.post('http://localhost:5000/login/', credentials)
      .success(function(data, status, headers, config) {

        loggedIn = true;
        localStorageService.set('authorizationToken', data.access_token);
        $http.defaults.headers.common.Authorization = data.access_token;

        authService.loginConfirmed(data, function(config) {
          config.headers.Authorization = data.access_token;
          return config;
        });
        q.resolve('Login success! Token: '+data.access_token);
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
        q.reject(status);
      });
      return q.promise;
    },

    logout: function() {
      loggedIn = false;
      $http.post('http://localhost:5000/logout/', {}, { ignoreAuthModule: true })
      .success(function(data, status, headers, config) {
        localStorageService.remove('authorizationToken');
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
        console.log('AuthenticationService LogOut!');
        $state.go('signin');
      });
    },

    isLoggedIn: function() {
      return loggedIn;
    },

    loginCancelled: function() {
      authService.loginCancelled();
    }

  };
  return self;
}])

.service('LoginService', ['$q', function($q) {
  var self = {

    data: {
      email: 'example@mail.com',
      phone: '+380730000000',
      type: 'email',
      code: ''
    },

    signin: function(email, password) {
      var q = $q.defer();
      if (email == 'example@mail.com' && password == '0000') {
        q.resolve('Success !');
      } else {
        q.reject('Please check your login or password!');
      }
      return q.promise;
    },

    signup: function(email, phone, conformation) {
      var q = $q.defer();
      self.data.conformation = conformation;
      if (email == 'example@mail.com' && phone == '+380730000000') {
        q.resolve('Success!');
      } else {
        q.reject('Server validation error!');
      }
      return q.promise;
    },

    confirm: function(code) {
      var q = $q.defer();
      if (code == '0000') {
        q.resolve('Success!');
      } else {
        q.reject('Invalid code!');
      }
      return q.promise;
    },

    passwordRecovery: function(code) {
      var q = $q.defer();
      q.resolve('Success!');
      return q.promise;
    },

    passwordRestore: function(code) {
      var q = $q.defer();
      q.resolve('Success!');
      return q.promise;
    }
  };
  return self;
}])

.factory('User', function($resource) {
  return $resource('http://localhost:5000/user/');
})

.factory('Trip', function($resource) {
  return $resource('http://localhost:5000/trips/:id/', {
    id: '@id'
  },{
    update: {
      method: 'PUT'
    }
  });
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
