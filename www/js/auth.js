angular.module('app.auth', ['http-auth-interceptor', 'LocalStorageModule', 'ngMockE2E'])

.run(function($ionicPlatform, $httpBackend, localStorageService) {
  $httpBackend.whenGET('https://posts')
  .respond(function(method, url, data, headers) {
    var authToken = localStorageService.get('authorizationToken');
    return authToken ? [200, posts] : [401];
  });

  $httpBackend.whenPOST('https://login')
  .respond(function(method, url, data) {
    var authToken = 'NjMwejfsdokKJKI799KJNKljhdskkk';
    return [200, {
      authorizationToken: authToken
    }];
  });

  $httpBackend.whenPOST('https://logout')
  .respond(function(method, url, data) {
    return [200];
  });

  $httpBackend.whenGET(/.*/).passThrough();

})
.factory('AuthenticationService',
  function($log, $rootScope, $http, authService, localStorageService) {
    $log.info('AuthenticationService');
    var loggedIn = false;
    var service = {
      login: function(credentials) {
        $http.post('https://login', {
          user: credentials
        }, {
          ignoreAuthModule: true
        })
        .success(function(data, status, headers, config) {
          loggedIn = true;

          $http.defaults.headers.common.Authorization = data.authorizationToken;
          localStorageService.set('authorizationToken', data.authorizationToken);

          authService.loginConfirmed(data, function(config) {
            config.headers.Authorization = data.authorizationToken;
            return config;
          });
        })
        .error(function(data, status, headers, config) {
          $rootScope.$broadcast('event:auth-login-failed', status);
        });
      },

      isLoggedIn: function() {
        return loggedIn;
      },

      loginCancelled: function() {
        authService.loginCancelled();
      },

      logout: function() {
        loggedIn = false;

        $http.post('https://logout', {}, {
          ignoreAuthModule: true
        })
        .finally(function(data) {
          localStorageService.remove('authorizationToken');
          delete $http.defaults.headers.common.Authorization;
          $rootScope.$broadcast('event:auth-logout-complete');
        });
      }
    };
    return service;
  }
);
