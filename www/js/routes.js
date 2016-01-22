angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // LOGIN
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
  //REGISTRATION
  .state('regOne', {
    url: '/reg-one',
    templateUrl: 'templates/registration-one.html',
    controller: 'regCtrl'
  })

  .state('regTwo', {
    url: '/reg-two',
    templateUrl: 'templates/registration-two.html',
    controller: 'regCtrl'
  })

  .state('regThree', {
    url: '/reg-three',
    templateUrl: 'templates/registration-three.html',
    controller: 'regCtrl'
  })

  // Password Recovery
  .state('passwordRecovery', {
    url: '/password-recovery',
    templateUrl: 'templates/password-recovery.html',
    controller: 'passwordRecoveryCtrl'
  })
  // Password Recovery Conformation
  .state('passwordRecoveryConformation', {
    url: '/password-recovery-conformation',
    templateUrl: 'templates/password-recovery-conformation.html',
    controller: 'passwordRecoveryCtrl'
  })
  // Password Reset
  .state('passwordReset', {
    url: '/password-reset',
    templateUrl: 'templates/password-reset.html',
    controller: 'passwordRecoveryCtrl'
  })

  //main
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  //SETTINGS
  .state('main.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  //HELP
  .state('main.help', {
    url: '/help',
    views: {
      'menuContent': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

  //PROFILE
  .state('main.user', {
    url: "/user",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "templates/user/user.html",
        controller: 'userCtrl'
      }
    }
  })

  .state('main.user.profile', {
    url: '/profile',
    views: {
      'profile': {
        templateUrl: 'templates/user/tab-profile.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('main.user.password', {
    url: '/password',
    views: {
      'password': {
        templateUrl: 'templates/user/tab-password.html',
        controller: 'userCtrl'
      }
    }
  })

  //TRIPS LIST
  .state('main.trips', {
    url: '/trips',
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: 'templates/trips/list.html',
        controller: 'tripsCtrl'
      }
    }
  })

  //SINGLE TRIP
  .state('main.trip', {
    url: '/trips/:id',
    abstract: true,
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/trips/item.html',
        controller: 'tripCtrl'
      }
    }
  })

  //TRIP data
  .state('main.trip.data', {
    url: '/data',
    views: {
      'data': {
        templateUrl: 'templates/trips/tab-data.html'
      }
    }
  })

  //TRIP checks
  .state('main.trip.checks', {
    url: '/checks',
    views: {
      'checks': {
        templateUrl: 'templates/trips/tab-checks.html'
      }
    }
  })

  //TRIP declarations
  .state('main.trip.declarations', {
    url: '/declarations',
    views: {
      'declarations': {
        templateUrl: 'templates/trips/tab-declarations.html'
      }
    }
  })

  //CHECKS LIST
  .state('main.checks', {
    url: '/checks',
    views: {
      'menuContent': {
        templateUrl: 'templates/checks/list.html',
        controller: 'checksCtrl'
      }
    }
  })

  //SINGLE CHECK
  .state('main.check', {
    url: '/checks/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/checks/item.html',
        controller: 'checkCtrl'
      }
    }
  })

  //DECLARATIONS LIST
  .state('main.declarations', {
    url: '/declarations',
    views: {
      'menuContent': {
        templateUrl: 'templates/declarations/list.html',
        controller: 'declarationsCtrl'
      }
    }
  })

  //SINGLE DECLARATION
  .state('main.declaration', {
    url: '/declarations/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/declarations/item.html',
        controller: 'declarationCtrl'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
