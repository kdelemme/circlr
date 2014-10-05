/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminPhotosCtrl', ['$scope', '$http', '_', 'CircleService', 'PhotoService', 'Options',
	function AdminPhotosCtrl($scope, $http, _, CircleService, PhotoService, Options) {

		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;
		$scope.circles = [];
		$scope.photos = [];

		var _offset = 0;
		$scope.hasMorePhotoToLoad = true;

		CircleService.getCircles().then(function(data) {
			$scope.circles = data;
		});

		PhotoService.getAllPhotos($scope.offset).then(function(data) {
			$scope.photos = data;
		});

		$scope.deletePhoto = function(photoId) {
			PhotoService.deletePhoto(photoId).then(function(data) {
				// removes the photo from the $scope.photos
				$scope.photos = _.filter($scope.photos, function(photo) {
					return photo._id != photoId;
				});
			});
		}

		$scope.updateDescription = function(photoId, description) {
			if (description != undefined && description.trim().length > 0) {
				PhotoService.updateDescription(photoId, description).then(function(data) {
					// $scope.photos is already updated :) 
				});
			}
		}

		$scope.updateCircles = function(photoId, circles) {			
			circles = circles || [];

			PhotoService.updateCircles(photoId, circles).then(function(data) {
				var currentPhoto = _.find($scope.photos, function(p) {
					return p._id == photoId;
				});

				if (currentPhoto) {
					currentPhoto.circles = circles;
				}
			});
		}

		$scope.loadMorePhoto = function() {
			_offset++;

			PhotoService.getAllPhotos(_offset).then(function(data) {
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


