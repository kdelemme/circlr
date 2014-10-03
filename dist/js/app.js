'use strict';

var app = angular.module('circlr', ['ui.router', 'angularFileUpload', 'appRoutes', 'appControllers', 'appServices', 'appDirectives', 'appFilters']);
var appRoutes = angular.module('appRoutes', []);
var appControllers = angular.module('appControllers', []);
var appServices = angular.module('appServices', []);
var appDirectives = angular.module('appDirectives', []);
var appFilters = angular.module('appFilters', []);

app.constant('Options', {
	baseUrlApi: 'http://localhost:3014',
	urlPhotoPrefix: 'http://localhost/static/circlr/img/'
});

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
/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminCirclesCtrl', ['$scope', '$http', 'CircleService', 'Options',
	function AdminCirclesCtrl($scope, $http, CircleService, Options) {

		$scope.circles = CircleService.getCircles();

		$scope.addCircle = function(circle) {
			if (circle != null && circle.name != null) {
				var saved = CircleService.createCircle(circle);
				if (saved) {
					console.log('saved !');
				}
			}
		}

		$scope.deleteCircle = function(id) {
			if (id != null) {
				var deleted = CircleService.deleteCircle(id);
				if (deleted) {
					//do some stuff
				}
			}
		}

		$scope.editCircle = function(circle) {
			if (circle != null && circle._id != null && circle.name != null) {
				var saved = CircleService.editCircle(circle._id, circle);
				if (saved) {
					//do some stuff
				}
			}
		}

		$scope.copyCircleUrl = function(circleKey) {
			console.log(Options.shareUrlPrefix + circleKey);
		}
	}
]);



/*
 * Admin Controller
 * Root Controller
 */
appControllers.controller('AdminCtrl', ['$scope', '$http',
	function AdminCtrl($scope, $http) {
		
	}
]);



/*
 * Admin Circles Controller
 * Handles the creation of new circle, 
 * Handles the deletion of existing circle
 * Handles the edition of existing circle
 */
appControllers.controller('AdminPhotosCtrl', ['$scope', '$http', '_', 'CircleService', 'PhotoService', 'Options',
	function AdminPhotosCtrl($scope, $http, _, CircleService, PhotoService, Options) {

		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;
		$scope.circles = CircleService.getCircles();
		$scope.photos = [];

		$scope.offset = 0;
		$scope.hasMorePhotoToLoad = true;

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
			$scope.offset++;

			PhotoService.getAllPhotos($scope.offset).then(function(data) {
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



/*
 * Admin Upload Photos
 */
appControllers.controller('AdminUploadCtrl', ['$scope', '$upload', '$http', 'Options',
	function AdminUploadCtrl($scope, $upload, $http, Options) {

		$scope.uploads = [];

		$scope.onFileSelect = function($files) {
		    //$files: an array of files selected, each file has name, size, and type.
		    for (var i = 0; i < $files.length; i++) {	    	
		    	
		    	// Closure (isolates i)
		    	(function(i) {
		    		var file = $files[i];

			    	$scope.uploads.push({name: file.name, progress: 0, error: false});

			      	$scope.upload = $upload.upload({
			        	url: Options.baseUrlApi + '/photos',
				        method: 'POST',
				        headers: {'Content-Type': file.type},
				        withCredentials: true,
			        	file: file, 
			      	}).progress(function(evt) {
			      		$scope.uploads[i].progress = parseInt(100.0 * evt.loaded / evt.total);	      		
			      	}).success(function(data, status, headers, config) {
			        	$scope.uploads[i].error = false;
			      	}).error(function(data, status, headers, config) {
			      		$scope.uploads[i].error = true;
			      	});

		    	})(i);
		    	
		    }
	  	};
		
	}
]);

/*
 * Circlr Controller
 * Root Controller for public pages
 */
appControllers.controller('CirclrCtrl', ['$scope', '$http',
	function CirclrCtrl($scope, $http) {
		
		
	}
]);



/*
 * Circlr Private Controller
 * Handle the display of private photos for the specified circleKey + public photos
 */
appControllers.controller('CirclrPrivateCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPrivateCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		$scope.circleKey = $stateParams.circleKey;
		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;

		$scope.offset = 0;
		$scope.hasMorePhotoToLoad = true;

		$scope.photos = [];

		PhotoService.getPrivatePhotosByCircleKey($scope.offset, $scope.circleKey).then(function(data) {
			$scope.photos = data;
		});


		$scope.loadMorePhoto = function() {
			$scope.offset++;

			PhotoService.getPrivatePhotosByCircleKey($scope.offset, $scope.circleKey).then(function(data) {
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



/*
 * Circlr Public Controller
 * Handles the display of public photos
 */
appControllers.controller('CirclrPublicCtrl', ['$scope', '$http', '$stateParams', 'PhotoService', 'Options',
	function CirclrPublicCtrl($scope, $http, $stateParams, PhotoService, Options) {
		
		$scope.photos = [];
		$scope.urlPhotoPrefix = Options.urlPhotoPrefix;

		$scope.offset = 0;
		$scope.hasMorePhotoToLoad = true;

		PhotoService.getPublicPhotos($scope.offset).then(function(data) {
			$scope.photos = data;
		});

		$scope.loadMorePhoto = function() {
			$scope.offset++;

			PhotoService.getPublicPhotos($scope.offset).then(function(data) {
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



appDirectives.directive('circlrAdminPhoto', function() {
	return {
		restrict: 'E',
		scope: {
			url: '=',
			description: '=',
			circles: '=',
			availableCircles: '=',
			updateDescription: '&onUpdateDescription',
			deletePhoto: '&onDeletePhoto',
			updateCircles: '&onUpdateCircles'
		},
		templateUrl: 'partials/directives/circlr.admin.photo.html',
		controller: function($scope) {

			var circles = $scope.circles;
			
			$scope.updateCircleList = function(circle) {
				var alreadyInCircles = $scope.isAlreadyInCircles(circle);

				if (alreadyInCircles) {
					circles = _.filter(circles, function(c) {
						return c != circle._id;
					});
				}
				else {
					circles.push(circle._id);
				}

				$scope.updateCircles({circles: circles});
			}

			$scope.isAlreadyInCircles = function(circle) {
				var alreadyInCircles = _.some(circles, function(c) {
					return c == circle._id;
				});

				return alreadyInCircles;
			}
		}
	};
});
appDirectives.directive('circlrAdminUpload', function() {
	return {
		restrict: 'E',
		scope: {
			uploads: '=',
		},
		templateUrl: 'partials/directives/circlr.admin.upload.html'
	};
});
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

appServices.factory('CircleService', ['$http', '$q', '_', 'Options', 
	function($http, $q,  _, Options) {

		var _circles = [];

		return {
			getCircles: function() {
				_circles = [];

				$http.get(Options.baseUrlApi + '/circles').success(function(data) {
					_.each(data, function(circle) {
						_circles.push(circle);
					})
				}).error(function(data, status) {
					console.log(data);
				});

				return _circles;
			},

			getCircle: function(id) {
				var circle = _.find(_circles, function(c) {
					return c._id == id;
				});

				return circle || null;
			},

			createCircle: function(circle) {
				return $http.post(Options.baseUrlApi + '/circles', circle).success(function(data) {
					_circles.push(data);
					return true;
				}).error(function(data, status) {
					console.log(data);
					return false;
				});
			},

			deleteCircle: function(id) {
				$http.delete(Options.baseUrlApi + '/circles/' + id).success(function(data) {
					_circles = _.filter(_circles, function(c) {
						return c._id != id;
					});

					return true;
				}).error(function(data, status) {
					console.log(data);
					return false;
				});
			},

			editCircle: function(id, circle) {
				$http.put(Options.baseUrlApi + '/circles/' + id, circle).success(function(data) {

					var circleToUpdate = _.find(_circles, function(c) {
						return c._id == id;
					});

					circleToUpdate = circle;
					return true;
				}).error(function(data, status) {
					console.log(data);
					return false;
				});
			}
		};
	}
]);
appServices.factory('PhotoService', function($http, $q, Options) {
	return {
		getPublicPhotos: function(offset) {
			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/photos/offsets/' + offset).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		getPrivatePhotosByCircleKey: function(offset, circleKey) {
			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/photos/' + circleKey + '/offsets/' + offset).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		getAllPhotos: function(offset) {
			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/photos/all/offsets/' + offset).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		updateDescription: function(photoId, description) {
			var deferred = $q.defer();

			$http.put(Options.baseUrlApi + '/photos/' + photoId, {description: description}).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		deletePhoto: function(photoId) {
			var deferred = $q.defer();

			$http.delete(Options.baseUrlApi + '/photos/' + photoId).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		updateCircles: function(photoId, circles) {
			var deferred = $q.defer();

			$http.put(Options.baseUrlApi + '/photos/' + photoId + '/circles', {circles: circles}).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		}
	};
});
appServices.factory('_', function() {
	return window._;
});