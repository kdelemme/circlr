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
appControllers.controller('AdminCirclesCtrl', ['$scope', '$http', '_', 'CircleService', 'Options',
	function AdminCirclesCtrl($scope, $http, _, CircleService, Options) {

		$scope.circles = [];

		CircleService.getCircles().then(function(data) {
			$scope.circles = data;
		});

		$scope.saveCircle = function(circle) {
			if (circle != null && circle.name != null) {
				CircleService.saveCircle(circle).then(
					/* successCallback */
					function(data) {

						$scope.circleForm = {};

						if (circle._id) {
							// update existing circle
							_.each($scope.circles, function(c, index, circles) {
								if (c._id == circle._id) {
									circles[index] = circle;
									return ;
								}
							});
						}
						else {
							//new circle
							$scope.circles.push(data);
						}
					},

					/* errorCallback */
					function(data) {

					}
				);
			}
		}

		$scope.deleteCircle = function(id) {
			if (id != null) {
				CircleService.deleteCircle(id).then(
					/* successCallback */
					function(data) {

						$scope.circles = _.filter($scope.circles, function(c) {
							return c._id != id;
						});
					},

					/* errorCallback */
					function(data) {
						
					}
				);
			}
		}

		$scope.editCircle = function(circle) {
			$scope.circleForm = angular.copy(circle);
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
		$scope.circles = [];
		$scope.photos = [];

		CircleService.getCircles().then(function(data) {
			$scope.circles = data;
		});

		PhotoService.getAllPhotos().then(function(data) {
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

		$scope.loadMorePhoto = function(offset) {
			return PhotoService.getAllPhotos(offset);
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
			photos: '='
		},
		templateUrl: 'partials/directives/circlr.load.more.photo.html',
		controller: function($scope) {
			var offset = 0;
			$scope.hasMorePhotoToLoad = true;

			$scope.loadMore = function() {
				offset++;
				
				$scope.loadMorePhoto({offset: offset}).then(function(data) {
					if (data && data.length > 0) {
						$scope.photos = $scope.photos.concat(data);
					}
					else {
						$scope.hasMorePhotoToLoad = false;
					}
				});
			}
			
		}
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
	function($http, $q, _, Options) {

		return {
			getCircles: function() {
				var deferred = $q.defer();

				$http.get(Options.baseUrlApi + '/circles').success(function(data) {
					deferred.resolve(data);
				}).error(function(data, status) {
					deferred.reject(data);
				});

				return deferred.promise;;
			},

			saveCircle: function(circle) {
				if (circle == null || circle.name == null || circle.name.trim().length == 0) {
					return false;
				} 

				var deferred = $q.defer();

				if (circle._id) {
					// Update
					$http.put(Options.baseUrlApi + '/circles/' + circle._id, circle).success(function(data) {
						deferred.resolve(data);
					}).error(function(data, status) {
						deferred.reject(data);
					});

				} else {
					// Save new
					$http.post(Options.baseUrlApi + '/circles', circle).success(function(data) {
						deferred.resolve(data);
					}).error(function(data, status) {
						deferred.reject(data);
					});
				}

				return deferred.promise;
			},

			deleteCircle: function(id) {
				if (id == null) {
					return false;
				}
				
				var deferred = $q.defer();
				
				return $http.delete(Options.baseUrlApi + '/circles/' + id).success(function(data) {
					deferred.resolve(data);
				}).error(function(data, status) {
					deferred.reject(data);
				});

				return deferred.promise;
			}

		};
	}
]);
appServices.factory('PhotoService', function($http, $q, Options) {
	return {
		getPublicPhotos: function(offset) {
			if (offset === undefined || offset === null) {
				offset = 0;
			}

			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/photos/offsets/' + offset).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		getPrivatePhotosByCircleKey: function(circleKey, offset) {
			if (offset === undefined || offset === null) {
				offset = 0;
			}

			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/photos/' + circleKey + '/offsets/' + offset).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		getAllPhotos: function(offset) {
			if (offset === undefined || offset === null) {
				offset = 0;
			}
			
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