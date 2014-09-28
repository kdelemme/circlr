/*
 * Circlr Public Controller
 * Handles the display of public photos
 */
appControllers.controller('CirclrPublicCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPublicCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		$scope.photos = [];
		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;

		$scope.offset = 0;
		$scope.hasMorePhotoToLoad = true;

		PhotoService.getPublicPhotos($scope.offset).then(function(data) {
			$scope.photos = data;
		});

		$scope.loadMorePhoto = function() {
			$scope.offset++;

			PhotoService.getPublicPhotos($scope.offset).then(function(data) {
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


