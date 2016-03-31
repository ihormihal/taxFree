//HELPERS
//language
if (!window.localStorage['lang']) {
	window.localStorage['lang'] = 'en';
}
var lngTranslate = function(text) {
	var lang = window.localStorage['lang'] ? window.localStorage['lang'] : 'en';
	if (text in window.translate[lang]) {
		return window.translate[lang][text];
	} else {
		return text;
	}
};

var serializeData = function(obj, prefix) {
	var str = [];
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p,
				v = obj[p];
			str.push(typeof v == "object" ?
				serializeData(v, k) :
				encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
	}
	return str.join("&");
};


angular.module('app', [
	'ionic',
	'ngCordova',
	'ui.mask',
	'app.config',
	'app.cordova',
	'app.routes',
	'app.services',
	'app.controllers',
	'app.controller.auth',
	'app.controller.dashboard',
	'app.controller.user',
	'app.controller.trips',
	'app.controller.checks',
	'app.controller.declarations',
	'app.controller.cards',
	'app.controller.faq',
	'app.controller.settings',
	'app.directives'
])


.run(function($rootScope, $state, $ionicPlatform, $ionicHistory, $cordovaFile, $cordovaNetwork, AppConfig, AuthService, Settings, Toast, Alert) {

	$ionicPlatform.ready(function() {

		$rootScope.$on('$cordovaNetwork:offline', function(event, offlineState) {
			if (offlineState) {
				Alert.show({
					message: lngTranslate('no_internet_message'),
					title: lngTranslate('no_internet')
				}, function(){
					$ionicHistory.goBack();
				});
			}
		});

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}

		//pressing on system back button
		var BackButtonPressed = 0;
		$ionicPlatform.registerBackButtonAction(function(event) {
			BackButtonPressed += 1;
		  if (BackButtonPressed == 1) {
		  	event.preventDefault();
		    $ionicHistory.goBack();
		  } else if(BackButtonPressed == 2){
		  	event.preventDefault();
		    Toast.show(lngTranslate('press_again_to_exit'));
		  } else if(BackButtonPressed == 3){
		  	navigator.app.exitApp();
		  }

			setTimeout(function() {
				BackButtonPressed = 0;
			}, 2000);

		}, 100);


		//HTTP-ERRORS preprocessing
		$rootScope.$on('http-error', function(event, data) {
			window.SpinnerPlugin.activityStop();
			$rootScope.$broadcast('scroll.refreshComplete');

			//Debug
			if ($rootScope.config.debug) {
				Alert.show({
					title: 'Server error',
					message: angular.toJson(data)
				});
			}

			var showErrorMsg = function(data) {
				var message = '';
				var isMessage = false;
				if (data) {
					if (data.error) {
						if (data.error.message) {
							message = data.error.message + '. ';
							isMessage = true;
						}
						if (data.error_description) {
							message += data.error_description + '. ';
							isMessage = true;
						}
					}
				}
				//defined errors
				if (isMessage) {
					// Alert.show({
					// 	message: message,
					// 	title: 'Error'
					// });
					Toast.show(message);
				//undefined errors
				} else {
					// Alert.show({
					// 	message: angular.toJson(data),
					// 	title: 'Error'
					// });
					Toast.show(angular.toJson(data));
				}
			};

			switch (data.status) {
				case 0:
					Alert.show({
						message: lngTranslate('no_internet_message'),
						title: lngTranslate('no_internet')
					}, function() {
						$ionicHistory.goBack();
					});
					break;
				case 400:
					if(data.data.error == 'invalid_grant'){
						AuthService.logout();
					}
					showErrorMsg(data.data);
					break;
				case 401:
					if(data.data.error == 'access_denied'){
						AuthService.logout();
						showErrorMsg(data.data);
					}else{
						AuthService.refresh();
					}
					break;
				case 404:
					$ionicHistory.goBack();
					break;
				default:
					showErrorMsg(data.data);
			}

			return false;

		});

		$rootScope.$on('auth-login-success', function(event, data) {

			var platform = null;
			if (ionic.Platform.isAndroid()) platform = 'google';
			if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) platform = 'apple';
			if (window.localStorage['deviceToken'] && platform) {
				Settings.sendDeviceToken({
					identifier: window.localStorage['deviceToken'],
					type: platform
				});
			}

			$state.go('main.dashboard');
		});

		$rootScope.$on('auth-login-error', function(event, data) {
			$state.go('login');
		});

		//login onload
		// if(window.localStorage['username'] && window.localStorage['password']){
		// 	AuthService.credentials.username = window.localStorage['username'];
		// 	AuthService.credentials.password = window.localStorage['password'];
		// 	AuthService.login();
		// }

		var push = null;

		try {

			push = PushNotification.init({
				android: {
					senderID: "327155649550"
				},
				ios: {
					alert: "true",
					badge: "true",
					sound: "true"
				},
				windows: {}
			});

			push.on('registration', function(data) {
				// data.registrationId
				window.localStorage['deviceToken'] = data.registrationId;
			});

			push.on('notification', function(data) {
				//console.log(angular.toJson(data));
				Alert.show({
					title: data.title || 'Tax Free 4U',
					message: data.message
				});
				Toast.show(data.additionalData);
				// data.message,
				// data.title,
				// data.count,
				// data.sound,
				// data.image,
				// data.additionalData
			});

			push.on('error', function(e) {
				// e.message
			});

		} catch (error){
			console.log(error);
		}

	}); //ionic ready end

});


