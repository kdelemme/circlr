appServices.factory('CircleService', ['$http', '_', 'Options', 
	function($http, _, Options) {

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

				console.log(_circles);

				return _circles;
			},

			getCircle: function(id) {
				var circle = _.find(_circles, function(c) {
					return c._id == id;
				});

				return circle;
			},

			saveCircle: function(circle) {
				if (circle == null || circle.name == null || circle.name.trim().length == 0) {
					return false;
				} 

				
				if (circle._id) {
					// Update

					return $http.put(Options.baseUrlApi + '/circles/' + circle._id, circle).success(function(data) {
						
						_.each(_circles, function(c, index, _circles) {
							if (c._id == circle._id) {
								_circles[index] = circle;
								return true;
							}
						});

						return false;
					}).error(function(data, status) {
						console.log(data);
						return false;
					});

				} else {
					// Save new

					return $http.post(Options.baseUrlApi + '/circles', circle).success(function(data) {
						_circles.push(data);
						return true;
					}).error(function(data, status) {
						console.log(data);
						return false;
					});
				}
			},

			deleteCircle: function(id) {
				if (id == null) {
					return false;
				}
				
				return $http.delete(Options.baseUrlApi + '/circles/' + id).success(function(data) {
					_.each(_circles, function(c, index, _circles) {
						if (c._id == id) {
							_circles.splice(index, 1);
							return true;
						}
					});

					return false;
				}).error(function(data, status) {
					console.log(data);
					return false;
				});
			}

		};
	}
]);