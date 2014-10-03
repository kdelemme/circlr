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