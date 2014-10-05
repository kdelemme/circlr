/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminCirclesCtrl', ['$scope', '$http', 'CircleService', 'Options',
	function AdminCirclesCtrl($scope, $http, CircleService, Options) {

		$scope.circles = CircleService.getCircles();

		$scope.saveCircle = function(circle) {
			if (circle != null && circle.name != null) {
				var saved = CircleService.saveCircle(circle);
				
				if (saved) {
					$scope.circleForm = {};
					console.log('saved !');
				}
			}
		}

		$scope.deleteCircle = function(id) {
			if (id != null) {
				var deleted = CircleService.deleteCircle(id);
				if (deleted) {
					console.log('Deleted !');
				}
			}
		}

		$scope.editCircle = function(circle) {
			$scope.circleForm = angular.copy(circle);
		}

		$scope.copyCircleUrl = function(circleKey) {
			console.log(Options.shareUrlPrefix + circleKey);
		}
	}
]);


