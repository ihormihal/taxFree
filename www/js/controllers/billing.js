angular.module('app.controller.billing', [])

/*** CARDS LIST ***/
.controller('cardsCtrl', function($rootScope, $scope, $state, $ionicModal, $cordovaActionSheet, Cards, Card, TaxFreeCard, Messages, Catalog, Toast) {

	$scope.cards = [];

	Messages.get({}, function(data) {
		$scope.messages = data.messages;
	});

	Catalog.query({
		name: 'currency'
	}, function(data) {
		$scope.prices = data;
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

						for (var i = 0; i < $scope.cards.length; i++) {
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
		$rootScope.loading = true;
		Cards.query({}, function(data) {
			$scope.cards = data;
			if ($scope.cards.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			for (var i = 0; i < $scope.cards.length; i++) {
				var length = $scope.cards[i].number.length;
				$scope.cards[i].num = '**** **** **** ' + $scope.cards[i].number.substr(length - 4, 4);
				//$scope.cards[i].num = $scope.cards[i].number;
			}

			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

	/////////////////////////////////////////////////

	$scope.card = {id: 'add', is_default: 0};

	$scope.card_taxfree = {
		cards: [{
			1: 50 //currency_id : price
		}]
	};

	$scope.$watch('card_taxfree.currency_index', function() {
		var cards = [{}];
		if($scope.card_taxfree.currency_index){
			var selected = $scope.prices[$scope.card_taxfree.currency_index];
			cards[0].currency = selected.id;
			cards[0].price = selected.card_price;
		}
		$scope.card_taxfree.cards = angular.toJson(cards);
	});

	$scope.modal = {taxfree: null, card: null};

	//load form for taxfree card
	$ionicModal.fromTemplateUrl('views/private/billing/order_taxfree.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal.taxfree = modal;
	});

	//load form for payment card
	$ionicModal.fromTemplateUrl('views/private/billing/add-card.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal.card = modal;
	});

	$scope.add = function() {
		var labels = [
			lngTranslate('order_taxfree_card'),
			lngTranslate('add_card')
		];
		try {
			$cordovaActionSheet.show({
				title: lngTranslate('card_adding'),
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
						$scope.modal.card.show();
						break;
					default:
						break;
				}
			});
		} catch (error) {
			console.log(error);
		}

	};
	$scope.$on('$destroy', function() {
		$scope.modal.taxfree.remove();
		$scope.modal.card.remove();
	});

	$scope.orderTaxFree = function() {
		TaxFreeCard.add($scope.card_taxfree, function(data) {
			$scope.modal.taxfree.hide();
			Toast.show(lngTranslate('toast_card_ordered'));
		});
	};
	$scope.addCard = function() {
		$scope.card.expire_month = $scope.card.expire_date.getMonth() + 1;
		$scope.card.expire_year = $scope.card.expire_date.getFullYear();
		Card.add($scope.card, function(data) {
			if (data.id) {
				$scope.modal.card.hide();
				Toast.show(lngTranslate('toast_card_added'));
				$state.go('main.card', {id: data.id});
			} else {
				Toast.show(lngTranslate('error_general'));
			}
		});
	};

})


/*** CARD ITEM ***/
.controller('cardCtrl', function($rootScope, $scope, $state, $stateParams, $ionicModal, $cordovaDialogs, Card, Toast) {

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

	$ionicModal.fromTemplateUrl('views/private/billing/edit-card.html', {
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

})


/*** ACCOUNTS LIST ***/
.controller('accountsCtrl', function($rootScope, $scope, $state, $ionicModal, $cordovaActionSheet, BankAccounts, BankAccount, Catalog, Toast) {

	$scope.account = {id: 'add', is_default: 0};

	$scope.accounts = [];

	$scope.load = function() {
		$rootScope.loading = true;
		BankAccounts.query({}, function(data) {
			$scope.accounts = data;
			if ($scope.accounts.length == 0) {
				Toast.show(lngTranslate('no_data'));
			}
			// for (var i = 0; i < $scope.cards.length; i++) {
			// 	var length = $scope.cards[i].number.length;
			// 	$scope.cards[i].num = '**** **** **** ' + $scope.cards[i].number.substr(length - 4, 4);
			// 	//$scope.cards[i].num = $scope.cards[i].number;
			// }

			$rootScope.loading = false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

	//load form for bank account
	$ionicModal.fromTemplateUrl('views/private/billing/add-account.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.add = function(){
		BankAccount.add($scope.account, function(data) {
			if (data.id) {
				$scope.modal.hide();
				Toast.show(lngTranslate('toast_account_added'));
				$state.go('main.billing.account', {id: data.id});
			} else {
				Toast.show(lngTranslate('error_general'));
			}
		});
	};
})

/*** ACCOUNT ITEM ***/
.controller('accountCtrl', function($rootScope, $scope, $state, $stateParams, $ionicModal, $cordovaDialogs, BankAccount, Toast) {

	$scope.account = null;

	$scope.load = function() {
		BankAccount.get({
			id: $stateParams.id
		}, function(data) {
			$scope.account = data;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.load();

	$scope.doRefresh = function() {
		$scope.load();
	};

	$ionicModal.fromTemplateUrl('views/private/billing/edit-account.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.delete = function() {
		$cordovaDialogs.confirm(
			lngTranslate('dialog_remove_bank_account_message'),
			lngTranslate('dialog_remove_bank_account_title'), [lngTranslate('yes'), lngTranslate('no')])
			.then(function(buttonIndex) {
				if (buttonIndex == 1) {
					BankAccount.delete({
						id: $scope.account.id
					}, function() {
						Toast.show(lngTranslate('toast_account_deleted'));
						$state.go('main.billing.accounts');
					});
				}
			});
	};

	$scope.update = function() {
		BankAccount.update({
			id: $scope.account.id
		}, $scope.account, function() {
			$scope.modal.hide();
			Toast.show(lngTranslate('toast_account_updated'));
		});
	};

});