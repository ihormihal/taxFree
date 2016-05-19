/*** FAQ SCREEN ***/
/* 
	- display faq
*/

angular.module('app.controller.faq', [])

.controller('faqCtrl', function($scope) {
	$scope.itemActive = null;
	$scope.toggleItem = function(index) {
		if ($scope.itemActive == index) {
			$scope.itemActive = null;
		} else {
			$scope.itemActive = index;
		}
	}
	$scope.faq = content.faq;
});