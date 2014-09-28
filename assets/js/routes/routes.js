appRoutes.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/photos');

	$stateProvider
	.state('circlr', {
		url: '/photos',
		abstract: true,
		controller: 'CirclrCtrl',
		templateUrl: 'partials/circlr.html'
	})
	.state('circlr.public', {
		url: '',
		controller: 'CirclrPublicCtrl',
		templateUrl: 'partials/circlr.gallery.html'
	})
	.state('circlr.private', {
		url: '/:circleKey',
		controller: 'CirclrPrivateCtrl',
		templateUrl: 'partials/circlr.gallery.html'
	})
	.state('admin', {
		url: '/admin',
		abstract: true,
		controller: 'AdminCtrl',
		templateUrl: 'partials/admin.html'
	})
	.state('admin.circles', {
		url: '/circles',
		controller: 'AdminCirclesCtrl',
		templateUrl: 'partials/admin.circles.html'
	})
	.state('admin.photos', {
		url: '/photos',
		controller: 'AdminPhotosCtrl',
		templateUrl: 'partials/admin.photos.html'
	})
	.state('admin.upload', {
		url: '/upload',
		controller: 'AdminUploadCtrl',
		templateUrl: 'partials/admin.upload.html'
	})
});