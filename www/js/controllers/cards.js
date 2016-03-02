angular.module('app.controller.cards', [])

/*** LIST ***/
.controller('cardsCtrl', function($scope, $state, $ionicModal, $cordovaActionSheet, Cards, Card, Messages, Toast) {

	Messages.get({}, function(data) {
		$scope.messages = data.messages;
		console.log(data.messages);
	});

	$scope.messageMenu = function(message, buttons){
		console.log(buttons);
		var labels = [];
		for(var i = 0; i < buttons.length; i++){
			labels.push(buttons[i].caption);
		}
		try {
			$cordovaActionSheet.show({
				title: message,
				buttonLabels: labels,
				addCancelButtonWithLabel: lngTranslate('cancel'),
				androidEnableCancelButton: true,
				winphoneEnableCancelButton: true
			})
				.then(function(btnIndex) {
					var action = buttons[btnIndex-1].link;
					switch(action) {
						case 'confirm_card_as_default':
							console.log('confirm_card_as_default');
							break;
						case 'about_card':
							console.log('about_card');
							break;
						case 'buy_card':
							console.log('buy_card');
							break;
						case 'close':
							console.log('close');
							break;
						default:
							break;
					}
				});
		} catch (error) {
			console.log(error);
		}
	};

	$scope.valid = {
		number: false,
		date: false
	};

	$scope.card = {
		id: 'add',
		is_default: 0
	};

	$scope.load = function() {
		Cards.query({}, function(data) {
			$scope.cards = data;
			if ($scope.cards.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			for (var i = 0; i < $scope.cards.length; i++) {
				$scope.cards[i].num = '**** **** **** ' + $scope.cards[i].number.substr(7, 4);
			}
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

	$scope.$watch('card', function() {

		if ($scope.card.number) {
			if ($scope.card.number.toString().length == 16) {
				$scope.valid.number = true;
			} else {
				$scope.valid.number = false;
			}
		}

		var now = new Date();
		if ($scope.card.expire_date < now) {
			$scope.valid.date = false;
		} else {
			$scope.valid.date = true;
		}


	}, true);

	$ionicModal.fromTemplateUrl('views/cards/add.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.add = function() {
		$scope.modal.show();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.create = function() {
		$scope.card.expire_month = $scope.card.expire_date.getMonth() + 1;
		$scope.card.expire_year = $scope.card.expire_date.getFullYear();
		Card.add($scope.card, function(data) {
			$scope.modal.hide();
			Toast.show(lngTranslate('toast_card_added'));
			$state.go('main.card', {
				id: data.id
			});
		});
	};

})


/*** ITEM ***/
.controller('cardCtrl', function($rootScope, $scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Card, Toast) {

	$scope.valid = {
		number: false,
		date: false
	};

	$scope.card = null;

	$scope.load = function() {
		Card.get({
			id: $stateParams.id
		}, function(data) {
			$scope.card = data;
			$scope.card.expire_date = new Date($scope.card.expire_year, $scope.card.expire_month - 1, 1);
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

	$scope.doRefresh = function() {
		$scope.load();
	};

	$scope.$watch('card', function() {

		if ($scope.card) {
			if ($scope.card.number.toString().length == 16) {
				$scope.valid.number = true;
			} else {
				$scope.valid.number = false;
			}


			var now = new Date();
			if ($scope.card.expire_date < now) {
				$scope.valid.date = false;
			} else {
				$scope.valid.date = true;
			}
		}


	}, true);

	$ionicModal.fromTemplateUrl('views/cards/edit.html', {
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

	$scope.delete = function() {
		$cordovaDialogs.confirm(
			lngTranslate('dialog_remove_card_message'),
			lngTranslate('dialog_remove_card_title'), [lngTranslate('yes'), lngTranslate('no')])
			.then(function(buttonIndex) {
				if (buttonIndex == 1) {
					Card.delete({
						id: $scope.card.id
					}, function() {
						Toast.show(lngTranslate('toast_card_deleted'));
						$state.go('main.cards');
					});
				}
			});
	};

	$scope.update = function() {
		$scope.card.expire_month = $scope.card.expire_date.getMonth() + 1;
		$scope.card.expire_year = $scope.card.expire_date.getFullYear();
		Card.update({
			id: $scope.card.id
		}, $scope.card, function() {
			$scope.modal.hide();
			Toast.show(lngTranslate('toast_card_updated'));
		});
	};

});