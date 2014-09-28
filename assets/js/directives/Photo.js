appDirectives.directive('circlrPhoto', function() {
	return {
		restrict: 'E',
		scope: {
			url: '=',
			description: '='
		},
		templateUrl: 'partials/directives/circlr.photo.html'
	};
});