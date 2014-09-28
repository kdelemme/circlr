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