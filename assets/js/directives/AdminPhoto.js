appDirectives.directive('circlrAdminPhoto', function() {
	return {
		restrict: 'E',
		scope: {
			url: '=',
			description: '=',
			circles: '=',
			availableCircles: '=',
			updateDescription: '&onUpdateDescription',
			deletePhoto: '&onDeletePhoto',
			updateCircles: '&onUpdateCircles'
		},
		templateUrl: 'partials/directives/circlr.admin.photo.html',
		controller: function($scope) {

			var circles = $scope.circles;
			$scope.isDescUpdated = false;
			$scope.initialDescription = $scope.description;
			
			$scope.updateCircleList = function(circle) {
				var alreadyInCircles = $scope.isAlreadyInCircles(circle);

				if (alreadyInCircles) {
					circles = _.filter(circles, function(c) {
						return c != circle._id;
					});
				}
				else {
					circles.push(circle._id);
				}

				$scope.updateCircles({circles: circles});
			}

			$scope.isAlreadyInCircles = function(circle) {
				var alreadyInCircles = _.some(circles, function(c) {
					return c == circle._id;
				});

				return alreadyInCircles;
			}

			$scope.updateDesc = function() {
				$scope.updateDescription();
				$scope.isDescUpdated = false;
				$scope.initialDescription = $scope.description;
			}
		},

		link: function(scope, element, attrs) {

			element.find("#inputDescription").on('keyup', function() {
				if (scope.initialDescription !== this.value) {
					scope.isDescUpdated = true;
				} else {
					scope.isDescUpdated = false;
				}
			});
		}
	};
});