appServices.factory('CircleService', function($http, $q, Options) {
	return {
		getCircles: function() {
			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/circles').success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		getCircle: function(id) {
			var deferred = $q.defer();

			$http.get(Options.baseUrlApi + '/circles/'+ id).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		createCircle: function(circle) {
			var deferred = $q.defer();

			$http.post(Options.baseUrlApi + '/circles', circle).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		deleteCircle: function(id) {
			var deferred = $q.defer();

			$http.delete(Options.baseUrlApi + '/circles/' + id).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		},

		editCircle: function(id, circle) {
			var deferred = $q.defer();

			$http.put(Options.baseUrlApi + '/circles/' + id, circle).success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(data);
			});

			return deferred.promise;
		}
	};
});