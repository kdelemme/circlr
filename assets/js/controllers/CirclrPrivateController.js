/*
 * Circlr Private Controller
 * Handle the display of private photos for the specified circleKey + public photos
 */
appControllers.controller('CirclrPrivateCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPrivateCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		$scope.circleKey = $stateParams.circleKey;
		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;

		$scope.offset = 0;
		$scope.hasMorePhotoToLoad = true;

		$scope.photos = [];

		PhotoService.getPrivatePhotosByCircleKey($scope.offset, $scope.circleKey).then(function(data) {
			$scope.photos = data;
		});


		$scope.loadMorePhoto = function() {
			$scope.offset++;

			PhotoService.getPrivatePhotosByCircleKey($scope.offset, $scope.circleKey).then(function(data) {
				if (data && data.length > 0) {
					$scope.photos = $scope.photos.concat(data);
				}
				else {
					$scope.hasMorePhotoToLoad = false;
				}
			});
		}

	}
]);


