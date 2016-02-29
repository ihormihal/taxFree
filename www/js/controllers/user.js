angular.module('app.controller.user', [])

.controller('userCtrl', function($rootScope, $scope, $ionicModal, Toast, User) {

	$scope.user = {
		profile: null,
		images: [],
		params: {}
	};

	$scope.load = function() {
		User.get({}, function(data) {
			$scope.user.profile = data;
			$scope.user.params = {
				user: $scope.user.profile.id
			};
			$scope.user.images[0] = {
				src: $scope.user.profile.passport,
				progress: 100,
				error: false
			};
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	$scope.load();

	$scope.update = function() {
		var ready = true;
		if($scope.user.images.length){
			if ($scope.user.images[0].progress == 100) {
				$scope.user.profile.passport = $scope.user.images[0];
			} else {
				ready = false;
			}
		}
		if(ready){
			User.update($scope.user.profile, function() {
				Toast.show(lngTranslate('toast_profile_updated'));
				$scope.closeModal();
			});
		}else{
			Toast.show(lngTranslate('please_wait_uploading'));
		}
	};

	$ionicModal.fromTemplateUrl('views/user/edit.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

});