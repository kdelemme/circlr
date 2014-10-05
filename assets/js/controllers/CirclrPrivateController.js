/*
 * Circlr Private Controller
 * Handle the display of private photos for the specified circleKey + public photos
 */
appControllers.controller('CirclrPrivateCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPrivateCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		var _circleKey = $stateParams.circleKey;
		var _urlPhotoPrefix = Options.urlPhotoPrefix;
		var _offset = 0;

		$scope.hasMorePhotoToLoad = true;

		$scope.photos = [];

		PhotoService.getPrivatePhotosByCircleKey(_offset, _circleKey).then(function(data) {
			$scope.photos = data;
		});

		$scope.loadMorePhoto = function() {
			_offset++;

			PhotoService.getPrivatePhotosByCircleKey(_offset, _circleKey).then(function(data) {
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


