/* ionic icons css-classes */
window.icons = {
	'new': 'ion-ios-clock-outline',
	'client-response' : 'ion-ios-refresh-outline',
	'request' : 'ion-ios-help-outline',
	'signed' : 'ion-ios-checkmark-empty',
	'digitalized' : 'ion-ios-list-outline',
	'processed' : 'ion-android-time',
	'refused' : 'ion-ios-close-outline',
	'pay' : 'ion-ios-checkmark-outline',
	'payment' : 'ion-ios-checkmark-outline',
	'paid' : 'ion-ios-checkmark',
	'shipping' : 'ion-ios-paperplane',
	'created' : 'ion-ios-clock-outline',
	'card_problems' : 'ion-ios-close-outline',
	'created_changes' : 'ion-ios-clock-outline',
	'future' : 'ion-android-more-horizontal',
	'current' : 'ion-ios-clock-outline',
	'past' : 'ion-ios-checkmark-empty',
	'updated' : 'ion-ios-refresh-outline',
	'validated' : 'ion-ios-checkmark-empty',
	'cant_pay': 'ion-ios-close-outline',
	'sent': 'ion-ios-paperplane',
	'delivered': 'ion-ios-checkmark'
};

/* main module configuration */
angular.module('app.config', ['ngResource'])

.config(function($httpProvider, $resourceProvider, $ionicConfigProvider) {
	/* disable navigation on swipe */
	$ionicConfigProvider.views.swipeBackEnabled(false);
	/* add Authorization token (if exists) for all http queries */
	if (window.localStorage['token']) {
		$httpProvider.defaults.headers.common['Authorization'] = window.localStorage['token'];
	}
	$resourceProvider.defaults.stripTrailingSlashes = false;
	$httpProvider.interceptors.push('httpInterceptor');
})


.factory('httpInterceptor', function($q, $rootScope) {
	return {
		// 'response': function(response) {

		// },
		//fire http-error event
		responseError: function(error) {
			var q = $q.defer();
			$rootScope.$broadcast('http-error', error);
			q.reject(error);
			return q.promise;
		}
	};
})

.service('AppConfig', function($rootScope, $state, $timeout, $ionicHistory) {

	/* App & API configuration */
	$rootScope.config = {
		version: '0.8.0',
		domain: 'https://taxfree4u.eu/', //default
		domains: {
			public_https: 'https://taxfree4u.eu/',
			public: 'http://taxfree4u.eu/',
			stage_public: 'http://stage.taxfree4u.eu/',
			stage: 'http://stage.tax-free-4u.com/',
			test: 'http://tax-free-4u.com/',
			dev: 'http://tax-free-dev.jaya-test.com/'
		},
		credentials: {
			client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
			client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk'
		},
		debug: false
	};

	/* Reading and saving configuration to local storage */
	if (window.localStorage['config']) {
		var storedConfig = angular.fromJson(window.localStorage['config']);
		if (storedConfig.version == $rootScope.config.version) {
			$rootScope.config = storedConfig;
		} else {
			window.localStorage['config'] = angular.toJson($rootScope.config);
		}
	} else {
		window.localStorage['config'] = angular.toJson($rootScope.config);
	}

	/* checking screen orientation changing */
	window.onresize = function() {
		$timeout(function() {
			checkOrientation();
		}, 300);
	};

	checkOrientation();

	function checkOrientation() {
		if (window.screen.height > window.screen.width) {
			$rootScope.orientation = 'portrait';
		} else {
			$rootScope.orientation = 'landscape';
		}
	};



	$rootScope.transports = [];
	$rootScope.countries = [];
	$rootScope.trips = [];

	$rootScope.getById = function(items, id) {
		if (!Array.isArray(items)) return id;
		for (var i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
				break;
			}
		}
	};

	$rootScope.checkTransports = function() {
		if ($rootScope.transports.length === 0) {
			Toast.show(lngTranslate('catalog_transports_loading'));
		}
	};
	$rootScope.checkCountries = function() {
		if ($rootScope.countries.length === 0) {
			Toast.show(lngTranslate('catalog_countries_loading'));
		}
	};

	//data object
	$rootScope.currentDate = function() {
		return new Date();
	};
	//in seconds
	$rootScope.currentTime = function() {
		return parseInt(new Date().getTime() / 1000);
	};


	/* global function goToScreen */
	/* 
		This function switches an application screen according to the parameter "entity"
	*/
	$rootScope.goToScreen = function(data) {

		switch (data.entity) {
			case 'profile':
				$state.go('main.profile');
				break;
			case 'trip':
				if (data.entity_id) {
					$state.go('main.trip.data', { id: data.entity_id });
				} else if (data.entity_id === 0) {
					$state.go('main.trips', { action: 'new' });
				} else {
					$state.go('main.trips');
				}
				break;
			case 'check':
				if (data.entity_id) {
					$state.go('main.check', { id: data.entity_id });
				} else if (data.entity_id === 0) {
					$state.go('main.checks', { action: 'new' });
				} else {
					$state.go('main.checks');
				}
				break;
			case 'receipt':
				if (data.entity_id) {
					$state.go('main.check', { id: data.entity_id });
				} else {
					$state.go('main.checks');
				}
				break;
			case 'declaration':
				if (data.entity_id) {
					$state.go('main.declaration', { id: data.entity_id });
				} else {
					$state.go('main.declarations');
				}
				break;
			case 'card':
				if (data.entity_id) {
					$state.go('main.card', { id: data.entity_id });
				} else {
					$state.go('main.cards');
				}
				break;
			case 'payment':
				if (data.entity_id) {
					$state.go('main.paymen', { id: data.entity_id });
				} else {
					$state.go('main.payments');
				}
				break;
			default:
				console.log([data.entity, data.entity_id]);
				break;
		}

	};

	/* Cordova SpinnerPlugin emulation if it`s not avaliable */
	if (!window.SpinnerPlugin) {
		window.SpinnerPlugin = {
			activityStart: function(message) {
				console.log(message);
			},
			activityStop: function() {
				console.log('spinner stop');
			}
		};
	}

});
