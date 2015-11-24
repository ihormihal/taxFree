angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('app', {
    url: '',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  // LOGIN
  .state('app.signin', {
    url: '/login/signin',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/signin.html',
        controller: 'signinCtrl'
      }
    }
  })

  .state('app.signup', {
    url: '/login/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('app.signupConformation', {
    url: '/login/signup-conformation/',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/signup-conformation.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('app.reg', {
    url: '/login/reg',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/reg.html',
        controller: 'regCtrl'
      }
    }
  })

  .state('app.passwordRecovery', {
    url: '/login/password-recovery',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/password-recovery.html',
        controller: 'passwordRecoveryCtrl'
      }
    }
  })

  .state('app.passwordRecoveryConformation', {
    url: '/login/password-recovery-conformation/',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/password-recovery-conformation.html',
        controller: 'passwordRecoveryCtrl'
      }
    }
  })

  .state('app.passwordRestore', {
    url: '/login/password-restore',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/password-restore.html',
        controller: 'passwordRecoveryCtrl'
      }
    }
  })

  //HELP
  .state('app.help', {
    url: '/help',
    views: {
      'menuContent': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

  //PROFILE
  .state('app.profile', {
    url: "/profile",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
      }
    }
  })

  .state('app.profile.main', {
    url: '/main',
    views: {
      'main': {
        templateUrl: 'templates/profile/main.html',
        controller: 'profileMainCtrl'
      }
    }
  })

  .state('app.profile.additional', {
    url: '/additional',
    views: {
      'additional': {
        templateUrl: 'templates/profile/additional.html',
        controller: 'profileAdditionalCtrl'
      }
    }
  })

  .state('app.profile.pass', {
    url: '/pass',
    views: {
      'pass': {
        templateUrl: 'templates/profile/pass.html',
        controller: 'profilePassCtrl'
      }
    }
  })

  .state('app.profile.address', {
    url: '/address',
    views: {
      'address': {
        templateUrl: 'templates/profile/address.html',
        controller: 'profileAddressCtrl'
      }
    }
  })

  //TRIPS LIST
  .state('app.trips', {
    url: '/trips',
    views: {
      'menuContent': {
        templateUrl: 'templates/trips.html',
        controller: 'tripsCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/trips/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/trip.html',
        controller: 'tripCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login/signin');

});
