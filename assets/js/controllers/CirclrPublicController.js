/*
 * Circlr Public Controller
 * Handles the display of public photos
 */
appControllers.controller('CirclrPublicCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPublicCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		$scope.photos = [];

		var _urlPhotoPrefix = Options.urlPhotoPrefix;
		var _offset = 0;

		$scope.hasMorePhotoToLoad = true;

		PhotoService.getPublicPhotos($scope.offset).then(function(data) {
			$scope.photos = data;
		});

		$scope.loadMorePhoto = function() {
			_offset++;

			PhotoService.getPublicPhotos(_offset).then(function(data) {
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


