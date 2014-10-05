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