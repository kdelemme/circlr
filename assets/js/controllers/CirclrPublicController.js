/*
 * Circlr Public Controller
 * Handles the display of public photos
 */
appControllers.controller('CirclrPublicCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPublicCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		$scope.photos = [];
		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;

		PhotoService.getPublicPhotos().then(function(data) {
			$scope.photos = data;
		});

		$scope.loadMorePhoto = function(offset) {
			return PhotoService.getPublicPhotos(offset);
		}
	}
]);


