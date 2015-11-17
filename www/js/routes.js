angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
           
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
      
    .state('profileController.main', {
      url: '/main',
      views: {
        'main': {
          templateUrl: 'templates/profile/main.html',
          controller: 'profileMainCtrl'
        }
      }
    })    
        
    .state('profileController.additional', {
      url: '/additional',
      views: {
        'additional': {
          templateUrl: 'templates/profile/additional.html',
          controller: 'profileAdditionalCtrl'
        }
      }
    })
    
    .state('profileController.pass', {
      url: '/pass',
      views: {
        'pass': {
          templateUrl: 'templates/profile/pass.html',
          controller: 'profilePassCtrl'
        }
      }
    })
        
    .state('profileController.address', {
      url: '/address',
      views: {
        'address': {
          templateUrl: 'templates/profile/address.html',
          controller: 'profileAddressCtrl'
        }
      }
    })
    
    .state('profileController', {
      url: '/profile',
      abstract: true,
      templateUrl: 'templates/profile.html'
    })
;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});