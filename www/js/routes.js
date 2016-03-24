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
    templateUrl: 'views/public/start.html',
    controller: 'startCtrl'
  })

  // LOGIN
  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'views/public/login.html',
    controller: 'loginCtrl'
  })
  //REGISTRATION
  .state('regOne', {
    url: '/reg-one',
    templateUrl: 'views/public/registration-one.html',
    controller: 'regCtrl'
  })

  .state('regTwo', {
    url: '/reg-two',
    templateUrl: 'views/public/registration-two.html',
    controller: 'regCtrl'
  })

  .state('regThree', {
    url: '/reg-three',
    templateUrl: 'views/public/registration-three.html',
    controller: 'regCtrl'
  })

  // Password Recovery
  .state('passwordOne', {
    url: '/password-one',
    templateUrl: 'views/public/password-recovery-one.html',
    controller: 'passwordCtrl'
  })
  // Password Recovery Conformation
  .state('passwordTwo', {
    url: '/password-two',
    templateUrl: 'views/public/password-recovery-two.html',
    controller: 'passwordCtrl'
  })
  // Password Reset
  .state('passwordThree', {
    url: '/password-three',
    templateUrl: 'views/public/password-recovery-three.html',
    controller: 'passwordCtrl'
  })

  //main
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'views/private/menu.html',
    controller: 'AppCtrl'
  })

  //SETTINGS
  .state('main.dashboard', {
    url: '/dashboard',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'views/private/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

  //SETTINGS
  .state('main.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'views/private/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  //ABOUT
  .state('main.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'views/private/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  //FAQ
  .state('main.faq', {
    url: '/faq',
    views: {
      'menuContent': {
        templateUrl: 'views/private/faq.html',
        controller: 'faqCtrl'
      }
    }
  })

  //TERMS
  .state('main.terms', {
    url: '/terms',
    views: {
      'menuContent': {
        templateUrl: 'views/private/terms.html',
        controller: 'termsCtrl'
      }
    }
  })

  //ABOUT TAXFREE CARD
  .state('main.about_taxfree_card', {
    url: '/about_taxfree_card',
    views: {
      'menuContent': {
        templateUrl: 'views/private/about_taxfree_card.html',
        controller: 'aboutCtrl'
      }
    }
  })

  //PROFILE
  .state('main.profile', {
    url: "/profile",
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: "views/private/user/profile.html",
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
        templateUrl: 'views/private/trips/list.html',
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
        templateUrl: 'views/private/trips/item.html',
        controller: 'tripCtrl'
      }
    }
  })

  //TRIP data
  .state('main.trip.data', {
    url: '/data',
    views: {
      'data': {
        templateUrl: 'views/private/trips/tab-data.html'
      }
    }
  })

  //TRIP checks
  .state('main.trip.checks', {
    url: '/checks',
    views: {
      'checks': {
        templateUrl: 'views/private/trips/tab-checks.html'
      }
    }
  })

  //TRIP declarations
  .state('main.trip.declarations', {
    url: '/declarations',
    cache:  false,
    views: {
      'declarations': {
        templateUrl: 'views/private/trips/tab-declarations.html'
      }
    }
  })

  //CHECKS LIST
  .state('main.checks', {
    url: '/checks',
    cache:  false,
    views: {
      'menuContent': {
        templateUrl: 'views/private/checks/list.html',
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
        templateUrl: 'views/private/checks/item.html',
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
        templateUrl: 'views/private/declarations/list.html',
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
        templateUrl: 'views/private/declarations/item.html',
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
        templateUrl: 'views/private/cards/list.html',
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
        templateUrl: 'views/private/cards/item.html',
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
        templateUrl: 'views/private/payments/list.html',
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
