/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminCirclesCtrl', ['$scope', '$http', 'CircleService', 'Options',
	function AdminCirclesCtrl($scope, $http, CircleService, Options) {

		$scope.circles = CircleService.getCircles();

		$scope.addCircle = function(circle) {
			if (circle != null && circle.name != null) {
				var saved = CircleService.createCircle(circle);
				
				if (saved) {
					console.log('saved !');
				}
			}
		}

		$scope.deleteCircle = function(id) {
			if (id != null) {
				var deleted = CircleService.deleteCircle(id);
				if (deleted) {
					//do some stuff
				}
			}
		}

		$scope.editCircle = function(circle) {
			if (circle != null && circle._id != null && circle.name != null) {
				var saved = CircleService.editCircle(circle._id, circle);
				if (saved) {
					//do some stuff
				}
			}
		}

		$scope.copyCircleUrl = function(circleKey) {
			console.log(Options.shareUrlPrefix + circleKey);
		}
	}
]);


