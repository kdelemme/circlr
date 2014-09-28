appDirectives.directive('circlrLoadMorePhoto', function() {
	return {
		restrict: 'E',
		scope: {
			loadMorePhoto: '&onLoadMorePhoto',
			hasMorePhotoToLoad: '='
		},
		templateUrl: 'partials/directives/circlr.load.more.photo.html'
	};
});