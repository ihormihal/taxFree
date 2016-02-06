angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // LOGIN
  .state('start', {
    url: '/start',
    templateUrl: 'templates/start.html',
    controller: 'startCtrl'
  })

  // LOGIN
  .state('login', {
    url: '/login',
    cache: false,
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
  .state('passwordOne', {
    url: '/password-one',
    templateUrl: 'templates/password-recovery-one.html',
    controller: 'passwordCtrl'
  })
  // Password Recovery Conformation
  .state('passwordTwo', {
    url: '/password-two',
    templateUrl: 'templates/password-recovery-two.html',
    controller: 'passwordCtrl'
  })
  // Password Reset
  .state('passwordThree', {
    url: '/password-three',
    templateUrl: 'templates/password-recovery-three.html',
    controller: 'passwordCtrl'
  })

  //main
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  //SETTINGS
  .state('main.dashboard', {
    url: '/dashboard',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
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

  //ABOUT
  .state('main.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  //FAQ
  .state('main.faq', {
    url: '/faq',
    views: {
      'menuContent': {
        templateUrl: 'templates/faq.html',
        controller: 'faqCtrl'
      }
    }
  })

  //TERMS
  .state('main.terms', {
    url: '/terms',
    views: {
      'menuContent': {
        templateUrl: 'templates/terms.html',
        controller: 'termsCtrl'
      }
    }
  })

  //PROFILE
  .state('main.profile', {
    url: "/profile",
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: "templates/user/profile.html",
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
    cache:  false,
    views: {
      'declarations': {
        templateUrl: 'templates/trips/tab-declarations.html'
      }
    }
  })

  //CHECKS LIST
  .state('main.checks', {
    url: '/checks',
    cache:  false,
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
    cache:  false,
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

  if(window.localStorage['ready']){
    $urlRouterProvider.otherwise('/login');
  }else{
    $urlRouterProvider.otherwise('/start');
  }

});
