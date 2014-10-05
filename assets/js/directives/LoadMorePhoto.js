appDirectives.directive('circlrLoadMorePhoto', function() {
	return {
		restrict: 'E',
		scope: {
			loadMorePhoto: '&onLoadMorePhoto',
			photos: '='
		},
		templateUrl: 'partials/directives/circlr.load.more.photo.html',
		controller: function($scope) {
			var offset = 0;
			$scope.hasMorePhotoToLoad = true;
			$scope.btnTextLoadMore = "Load More Awesomeness";

			$scope.loadMore = function() {
				offset++;
				
				$scope.loadMorePhoto({offset: offset}).then(function(data) {
					if (data && data.length > 0) {
						$scope.photos = $scope.photos.concat(data);
					}
					else {
						$scope.hasMorePhotoToLoad = false;
						$scope.btnTextLoadMore = "No More Awesomeness"
					}
				});
			}
			
		}
	};
});