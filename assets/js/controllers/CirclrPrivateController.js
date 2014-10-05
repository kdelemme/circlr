/*
 * Circlr Private Controller
 * Handle the display of private photos for the specified circleKey + public photos
 */
appControllers.controller('CirclrPrivateCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPrivateCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		var _circleKey = $stateParams.circleKey;
		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;
		$scope.photos = [];

		PhotoService.getPrivatePhotosByCircleKey(_circleKey).then(function(data) {
			$scope.photos = data;
		});

		$scope.loadMorePhoto = function(offset) {
			return PhotoService.getPrivatePhotosByCircleKey(_circleKey, offset);
		}

	}
]);


