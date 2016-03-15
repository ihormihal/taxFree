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
    templateUrl: 'views/start.html',
    controller: 'startCtrl'
  })

  // LOGIN
  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'views/login.html',
    controller: 'loginCtrl'
  })
  //REGISTRATION
  .state('regOne', {
    url: '/reg-one',
    templateUrl: 'views/registration-one.html',
    controller: 'regCtrl'
  })

  .state('regTwo', {
    url: '/reg-two',
    templateUrl: 'views/registration-two.html',
    controller: 'regCtrl'
  })

  .state('regThree', {
    url: '/reg-three',
    templateUrl: 'views/registration-three.html',
    controller: 'regCtrl'
  })

  // Password Recovery
  .state('passwordOne', {
    url: '/password-one',
    templateUrl: 'views/password-recovery-one.html',
    controller: 'passwordCtrl'
  })
  // Password Recovery Conformation
  .state('passwordTwo', {
    url: '/password-two',
    templateUrl: 'views/password-recovery-two.html',
    controller: 'passwordCtrl'
  })
  // Password Reset
  .state('passwordThree', {
    url: '/password-three',
    templateUrl: 'views/password-recovery-three.html',
    controller: 'passwordCtrl'
  })

  //main
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'AppCtrl'
  })

  //SETTINGS
  .state('main.dashboard', {
    url: '/dashboard',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

  //SETTINGS
  .state('main.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'views/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  //ABOUT
  .state('main.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'views/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  //FAQ
  .state('main.faq', {
    url: '/faq',
    views: {
      'menuContent': {
        templateUrl: 'views/faq.html',
        controller: 'faqCtrl'
      }
    }
  })

  //ABOUT TAXFREE CARD
  .state('main.about_taxfree_card', {
    url: '/about_taxfree_card',
    views: {
      'menuContent': {
        templateUrl: 'views/about_taxfree_card.html',
        controller: 'aboutCtrl'
      }
    }
  })

  //TERMS
  .state('main.terms', {
    url: '/terms',
    views: {
      'menuContent': {
        templateUrl: 'views/terms.html',
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
        templateUrl: "views/user/profile.html",
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
        templateUrl: 'views/trips/list.html',
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
        templateUrl: 'views/trips/item.html',
        controller: 'tripCtrl'
      }
    }
  })

  //TRIP data
  .state('main.trip.data', {
    url: '/data',
    views: {
      'data': {
        templateUrl: 'views/trips/tab-data.html'
      }
    }
  })

  //TRIP checks
  .state('main.trip.checks', {
    url: '/checks',
    views: {
      'checks': {
        templateUrl: 'views/trips/tab-checks.html'
      }
    }
  })

  //TRIP declarations
  .state('main.trip.declarations', {
    url: '/declarations',
    cache:  false,
    views: {
      'declarations': {
        templateUrl: 'views/trips/tab-declarations.html'
      }
    }
  })

  //CHECKS LIST
  .state('main.checks', {
    url: '/checks',
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: 'views/checks/list.html',
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
        templateUrl: 'views/checks/item.html',
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
        templateUrl: 'views/declarations/list.html',
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
        templateUrl: 'views/declarations/item.html',
        controller: 'declarationCtrl'
      }
    }
  })

  //DECLARATIONS LIST
  .state('main.cards', {
    url: '/cards',
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: 'views/cards/list.html',
        controller: 'cardsCtrl'
      }
    }
  })

  //SINGLE DECLARATION
  .state('main.card', {
    url: '/cards/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'views/cards/item.html',
        controller: 'cardCtrl'
      }
    }
  })

  //PAYMENTS LIST
  .state('main.payments', {
    url: '/payments',
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: 'views/payments/list.html',
        controller: 'paymentsCtrl'
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
