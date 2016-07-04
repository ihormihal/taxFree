/************************
* MAIN APPLICATION FILE *
*************************/

/* HELPERS */
/* default language */
if (!window.localStorage['lang']) {
	window.localStorage['lang'] = 'en';
}
/* translation function */
var lngTranslate = function(text) {
	var lang = window.localStorage['lang'] ? window.localStorage['lang'] : 'en';
	if (text in window.translate[lang]) {
		return window.translate[lang][text];
	} else {
		return text;
	}
};
/* this function serializing data object for post queries ß*/
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

/* MAIN application module */
angular.module('app', [
	'ionic',
	'ngCordova',
	'ui.mask',
	'barcodeGenerator',
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
	'app.controller.billing',
	'app.controller.faq',
	'app.controller.settings',
	'app.directives'
])

/* Execute on application start */
.run(function($rootScope, $state, $ionicPlatform, $ionicHistory, $cordovaFile, $cordovaNetwork, $cordovaDatePicker, AppConfig, AuthService, User, Settings, Toast, Alert) {

	/* Execute on device ready */
	$ionicPlatform.ready(function() {


		// var testDate = document.createElement('input');
		// testDate.type = 'date'; // or any other type
		// if (testDate.type === 'text') {
		// 	alert('date not supported');
		// } else {
		// 	alert('date supported!');
		// }

		// var testTime = document.createElement('input');
		// testTime.type = 'time'; // or any other type
		// if (testTime.type === 'text') {
		// 	alert('time not supported');
		// } else {
		// 	alert('time supported!');
		// }

		/* CORDOVA KEYBOARD CONFIG */
		$rootScope.$on('$ionicView.afterEnter', function() {
			// Handle iOS-specific issue with jumpy viewport when interacting with input fields.
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.disableScroll(true);
			}
		});
		$rootScope.$on('$ionicView.beforeLeave', function() {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				// return to keyboard default scroll state
				cordova.plugins.Keyboard.disableScroll(false);
			}
		});

		//do not hide keyboard accessory bar
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		}
		/* END CORDOVA KEYBOARD CONFIG */

		/* Checking network connection */
		$rootScope.$on('$cordovaNetwork:offline', function(event, offlineState) {
			if (offlineState) {
				/* Show error message if device is offline */
				Alert.show({
					message: lngTranslate('no_internet_message'),
					title: lngTranslate('no_internet')
				}, function(){
					/* Then go to previous screen */
					$ionicHistory.goBack();
				});
			}
		});

		//Android 6 fix
		/* Checking filesystem read permission */

		try {
			window.imagePicker.hasReadPermission(function(result){
				/* if no permission - show dialog */
				if(result === false){
					window.imagePicker.requestReadPermission();
				}
			});
		} catch (error){
			console.log(error);
		}

		//pressing on system back button
		var BackButtonPressed = 0;
		$ionicPlatform.registerBackButtonAction(function(event) {
			BackButtonPressed += 1;
			if (BackButtonPressed == 1) {
				event.preventDefault();
				//go to previous screen
				$ionicHistory.goBack();
			} else if (BackButtonPressed == 2) {
				event.preventDefault();
				//show toast message
				Toast.show(lngTranslate('press_again_to_exit'));
			} else if (BackButtonPressed == 3) {
				//exit from app on third pressing
				navigator.app.exitApp();
			}

			//reset timer after 2 seconds
			setTimeout(function() {
				BackButtonPressed = 0;
			}, 2000);

		}, 100);


		$rootScope.httpWaiting = false; //processing http errors
		$rootScope.formWaiting = false; //block all form buttons


		//HTTP-ERRORS preprocessing
		$rootScope.$on('http-error', function(event, data) {
			window.SpinnerPlugin.activityStop();
			$rootScope.$broadcast('scroll.refreshComplete');
			$rootScope.loading = false;
			$rootScope.formWaiting = false;

			//if debug mode - show all messages in alert pop-up
			if ($rootScope.config.debug) {
				Alert.show({
					title: 'Server error',
					message: angular.toJson(data)
				});
			}

			if(!$rootScope.httpWaiting){
				processHttpError(data);
			}

			return false;

		});

		/* Error processing functionы */
		/* This function displays error messages */
		function showHttpError(data) {
			var message = '';
			if (data) {
				if (data.error) {
					if (data.error.message) {
						message = data.error.message + '. ';
					}
					if (data.error_description) {
						message += data.error_description + '. ';
					}
				}
			}
			//defined errors
			if (message) {
				Toast.show(message);
			//undefined errors
			} else {
				Toast.show(angular.toJson(data));
			}
		};

		/* This function formats error messages from all http responses */
		function processHttpError(data){
			switch (data.status) {
				case 0:
					Alert.show({
						message: lngTranslate('no_internet_message'),
						title: lngTranslate('no_internet')
					}, function() {
						$rootScope.httpWaiting = false;
						$ionicHistory.goBack();
					});
					break;
				case 400:
					//invalid refresh token
					if(data.data.error == 'invalid_grant' && AuthService.credentials.grant_type == 'refresh_token'){
						$rootScope.httpWaiting = true;
						AuthService.login();
					}
					showHttpError(data.data);
					break;
				case 401:
					//invalid token
					if(data.data.error == 'invalid_grant'){
						$rootScope.httpWaiting = true;
						AuthService.refresh();
					}
					if(data.data.error == 'access_denied'){
						$rootScope.httpWaiting = true;
						AuthService.logout();
						showHttpError(data.data);
					}
					break;
				case 404:
					$ionicHistory.goBack();
					break;
				default:
					showHttpError(data.data);
			}
		}

		/* Successful authorization listener */
		$rootScope.$on('auth-login-success', function(event, data) {

			/* send device identifier (for push notifications) */
			var platform = null;
			if (ionic.Platform.isAndroid()) platform = 'google';
			if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) platform = 'apple';
			if (window.localStorage['deviceToken'] && platform) {
				Settings.sendDeviceToken({
					identifier: window.localStorage['deviceToken'],
					type: platform
				});
			}

			/* Getting user profile */
			User.get({}, function(data) {
				if(data.first_login){
					/* go to password reseting screen */
					$state.go('passwordThree', { token: data.confirmation_token });
				}else{
					/* go to dashboard */
					$state.go('main.dashboard');
				}
				if(window.localStorage['lang'] !== data.language){
					window.localStorage['lang'] = data.language;
					$rootScope.httpWaiting = true;
					window.location.reload(true);
				}
			});
		});

		/* Unsuccessful authorization listener */
		$rootScope.$on('auth-login-error', function(event, data) {
			$state.go('login');
		});

		//login onload
		// if(window.localStorage['username'] && window.localStorage['password']){
		// 	AuthService.credentials.username = window.localStorage['username'];
		// 	AuthService.credentials.password = window.localStorage['password'];
		// 	AuthService.login();
		// }

		/* Device registration on push-notification service */
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

				if(data.additionalData){
					$rootScope.goToScreen(data.additionalData.custom);
				}

				if ($rootScope.config.debug) {
					Alert.show({
						title: 'Debug PUSH',
						message: angular.toJson(data)
					});
				}else{
					Toast.show(data.message);
				}

				// data.message,
				// data.title,
				// data.count,
				// data.sound,
				// data.image,
				// data.additionalData
			});

			push.on('error', function(e) {
				// e.message
				if ($rootScope.config.debug) {
					Alert.show({
						title: 'Error PUSH',
						message: angular.toJson(e)
					});
				}
			});

		} catch (error){
			console.log(error);
		}

	}); //ionic ready end

});


