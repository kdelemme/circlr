/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminCirclesCtrl', ['$scope', '$http', '_', 'CircleService', 'Options',
	function AdminCirclesCtrl($scope, $http, _, CircleService, Options) {

		$scope.circles = [];

		CircleService.getCircles().then(function(data) {
			$scope.circles = data;
		});

		$scope.saveCircle = function(circle) {
			if (circle != null && circle.name != null) {
				CircleService.saveCircle(circle).then(
					/* successCallback */
					function(data) {

						$scope.circleForm = {};

						if (circle._id) {
							// update existing circle
							_.each($scope.circles, function(c, index, circles) {
								if (c._id == circle._id) {
									circles[index] = circle;
									return ;
								}
							});
						}
						else {
							//new circle
							$scope.circles.push(data);
						}
					},

					/* errorCallback */
					function(data) {

					}
				);
			}
		}

		$scope.deleteCircle = function(id) {
			if (id != null) {
				CircleService.deleteCircle(id).then(
					/* successCallback */
					function(data) {

						$scope.circles = _.filter($scope.circles, function(c) {
							return c._id != id;
						});
					},

					/* errorCallback */
					function(data) {
						
					}
				);
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


