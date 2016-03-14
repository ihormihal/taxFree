angular.module('app.controller.cards', [])

/*** LIST ***/
.controller('cardsCtrl', function($scope, $state, $ionicModal, $cordovaActionSheet, Cards, Card, TaxFreeCard, Messages, Toast) {

	$scope.cards = [];

	Messages.get({}, function(data) {
		$scope.messages = data.messages;
		console.log(data.messages);
	});

	$scope.messageMenu = function(message, buttons){
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

						for (var i = 0; i < $scope.cards; i++) {
							if($scope.cards[i].is_taxfree_card){
								Card.setDefault({id: $scope.cards[i].id}, function(data) {
									Toast.show(lngTranslate('taxfree_card_selected_as_default'));
									$scope.load();
								});
								break;
							}
						}

						break;
					case 'about_card':
						$state.go('main.about_taxfree_card');
						break;
					case 'buy_card':
						$scope.modal.taxfree.show();
						break;
					case 'close':
						$scope.messages = null;
						break;
					default:
						break;
				}
			});
		} catch (error) {
			console.log(error);
		}
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

	$scope.card_payment = {id: 'add', is_default: 0};

	$scope.card_taxfree = {
		cards: [{
			1: 50 //currency_id : price
		}]
	};

	//validate card info
	$scope.valid = {number: false, date: false};
	$scope.$watch('card_payment', function() {

		if ($scope.card_payment.number) {
			if ($scope.card_payment.number.toString().length == 16) {
				$scope.valid.number = true;
			} else {
				$scope.valid.number = false;
			}
		}

		var now = new Date();
		if ($scope.card_payment.expire_date < now) {
			$scope.valid.date = false;
		} else {
			$scope.valid.date = true;
		}

	}, true);

	$scope.modal = {taxfree: null, payment: null};
	//load form for taxfree card
	$ionicModal.fromTemplateUrl('views/cards/add_taxfree.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal.taxfree = modal;
	});
	//load form for payment card
	$ionicModal.fromTemplateUrl('views/cards/add_payment.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal.payment = modal;
	});

	$scope.add = function() {
		var labels = [
			lngTranslate('taxfree_card'),
			lngTranslate('payment_card')
		];
		try {
			$cordovaActionSheet.show({
				title: lngTranslate('select_card_type'),
				buttonLabels: labels,
				addCancelButtonWithLabel: lngTranslate('cancel'),
				androidEnableCancelButton: true,
				winphoneEnableCancelButton: true
			})
			.then(function(btnIndex) {
				switch(btnIndex) {
					case 1:
						$scope.modal.taxfree.show();
						break;
					case 2:
						$scope.modal.payment.show();
						break;
					default:
						break;
				}
			});
		} catch (error) {
			console.log(error);
		}

	};

	$scope.closeModal = function(type) {
		$scope.modal[type].hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.taxfree.remove();
		$scope.modal.payment.remove();
	});

	$scope.createTaxFreeCard = function() {
		TaxFreeCard.add($scope.card_taxfree, function(data) {
			$scope.modalTaxFreeCard.hide();
			Toast.show(lngTranslate('toast_card_added'));
			$state.go('main.card', {
				id: data.id
			});
		});
	};
	$scope.createPaymentCard = function() {
		$scope.card_payment.expire_month = $scope.card_payment.expire_date.getMonth() + 1;
		$scope.card_payment.expire_year = $scope.card_payment.expire_date.getFullYear();
		Card.add($scope.card_payment, function(data) {
			$scope.modal.payment.hide();
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