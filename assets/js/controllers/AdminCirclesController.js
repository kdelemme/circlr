/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminCirclesCtrl', ['$scope', '$http', '_', 'CircleService', 'Options',
	function AdminCirclesCtrl($scope, $http, _, CircleService, Options) {

		$scope.circles = [];

		CircleService.getCircles().then(function(data) {
			$scope.circles = data;
		});

		$scope.addCircle = function(circle) {
			if (circle != null && circle.name != null) {
				var alreadyDefined = _.find($scope.circles, function(c) {
					return c.name == circle.name;
				});

				// circle.name doesn't exist yet, so let's create it
				if (alreadyDefined == undefined) {
					CircleService.createCircle(circle).then(function(data) {
						//data contains {_id, circleKey and name}
						$scope.circles.push(data);
					});
				}
			}
		}

		$scope.deleteCircle = function(id) {
			if (id != null) {
				var exist = _.find($scope.circles, function(c) {
					return c._id == id;
				})

				//circle id exists, so we can deletes it
				if (exist != undefined) {
					CircleService.deleteCircle(id).then(function(data) {
						//remove the circle id from the list of circles
						$scope.circles = _.filter($scope.circles, function(c) {
							return c._id != id;
						});
					});
				}
			}
		}

		$scope.editCircle = function(circle) {
			if (circle != null && circle._id != null && circle.name != null) {
				var exist = _.find($scope.circles, function(c) {
					return c._id == circle._id;
				});

				if (exist != undefined) {
					CircleService.editCircle(circle._id, circle).then(function(data) {
						//TODO find method in underscorejs to modify array where predicates is true.
					});
				}
			}
		}

		$scope.copyCircleUrl = function(circleKey) {
			console.log(Options.shareUrlPrefix + circleKey);
		}
	}
]);


