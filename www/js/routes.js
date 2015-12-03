angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // LOGIN
  .state('signin', {
    url: '/login/signin',
    templateUrl: 'templates/login/signin.html',
    controller: 'signinCtrl'
  })
  // SIGNUP
  .state('signup', {
    url: '/login/signup',
    templateUrl: 'templates/login/signup.html',
    controller: 'signupCtrl'
  })
  // SIGNUP CONFORMATION
  .state('signupConformation', {
    url: '/login/signup-conformation',
    templateUrl: 'templates/login/signup-conformation.html',
    controller: 'signupCtrl'
  })
  // REG
  .state('reg', {
    url: '/login/reg',
    templateUrl: 'templates/login/reg.html',
    controller: 'regCtrl'
  })
  // Password Recovery
  .state('passwordRecovery', {
    url: '/login/password-recovery',
    templateUrl: 'templates/login/password-recovery.html',
    controller: 'passwordRecoveryCtrl'
  })
  // Password Recovery Conformation
  .state('passwordRecoveryConformation', {
    url: '/login/password-recovery-conformation',
    templateUrl: 'templates/login/password-recovery-conformation.html',
    controller: 'passwordRecoveryCtrl'
  })
  // Password Reset
  .state('passwordReset', {
    url: '/login/password-reset',
    templateUrl: 'templates/login/password-reset.html',
    controller: 'passwordRecoveryCtrl'
  })

  //main
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
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
  .state('main.profile', {
    url: "/profile",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
      }
    }
  })

  .state('main.profile.main', {
    url: '/main',
    views: {
      'main': {
        templateUrl: 'templates/profile/main.html',
        controller: 'profileMainCtrl'
      }
    }
  })

  .state('main.profile.password', {
    url: '/password',
    views: {
      'password': {
        templateUrl: 'templates/profile/password.html',
        controller: 'profilePasswordCtrl'
      }
    }
  })

  //TRIPS LIST
  .state('main.trips', {
    url: '/trips',
    views: {
      'menuContent': {
        templateUrl: 'templates/trips.html',
        controller: 'tripsCtrl'
      }
    }
  })

  .state('main.single', {
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
