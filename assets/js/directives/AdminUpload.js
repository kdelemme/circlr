appDirectives.directive('circlrAdminUpload', function() {
	return {
		restrict: 'E',
		scope: {
			uploads: '=',
		},
		templateUrl: 'partials/directives/circlr.admin.upload.html'
	};
});