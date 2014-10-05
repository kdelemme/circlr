describe("Test Circle Service", function() {

	var CircleService;

	var circlesMock = [
		{"circleKey":"744aae747671144e5bc661158b4934feb6429c5ea66adfc5","name":"Friends","_id":"543001ac79315f1341d33abe"},
		{"circleKey":"bbe75678a5dc9749436ec9548994364051fe48dbb7943b12","name":"Family","_id":"543011eda94d3b814b3502a3"}
	];

	var circleSaveMock = {
		"circleKey":"744aae747671144e5bc661158b4934feb6429c5ee66a5555",
		"name":"Test",
		"_id":"543001ac79315f1341d33abf"
	};
		

	beforeEach(module('circlr'));
	beforeEach(
		inject(function(_CircleService_, $injector) {
			CircleService = _CircleService_;
			$httpBackend = $injector.get('$httpBackend');

			$httpBackend.when('GET', 'http://localhost:3014/circles').respond(circlesMock);

			$httpBackend.when('PUT', /.*\/circles\/.*/).respond(function () {
				return [200, {}, {}];
			});

			$httpBackend.when('POST', /.*\/circles/).respond(function () {
				return [200, circleSaveMock, {}];
			});

			$httpBackend.when('DELETE', /.*\/circles\/.*/).respond(function () {
				return [200, {}, {}];
			});

		})
	);


	/**
	 * getCircles
	 */
	describe("getCircles function", function() {

		it("should return an empty array if no circles", function() {
			var circles = CircleService.getCircles();

	    	expect(circles.length).toBe(0);
	    });

		it("should return two circles", function() {
			var circles = CircleService.getCircles();
			$httpBackend.flush();

	    	expect(circles.length).toBe(2);
	    });
	});


	/**
	 * getCircle(id)
	 */
	describe("getCircle function", function() {

		it("should return undefined if no circle matches the specified id", function() {
	    	var circle = CircleService.getCircle(null);
	    	expect(circle).toBe(undefined);
		});

		it("should return Friends circle", function() {

			CircleService.getCircles();
			$httpBackend.flush();

	    	var circle = CircleService.getCircle('543001ac79315f1341d33abe');

	    	expect(circle).not.toBe(null);
	    	expect(circle.circleKey).toBe('744aae747671144e5bc661158b4934feb6429c5ea66adfc5');
	    	expect(circle.name).toBe('Friends');
	    	expect(circle._id).toBe('543001ac79315f1341d33abe');
	    });

	});


	/**
	 * saveCircle(circle)
	 */
	describe("saveCircle function", function() {

		it("should return false if circle is null", function() {
	    	var saved = CircleService.saveCircle(null);
	    	expect(saved).toBe(false);
		});

		it("should return false if circle.name is null", function() {
			var circle = {name: null};
	    	var saved = CircleService.saveCircle(circle);
	    	expect(saved).toBe(false);
		});

		it("should return false if circle.name is size 0", function() {
			var circle = {name: ''};
	    	var saved = CircleService.saveCircle(circle);
	    	expect(saved).toBe(false);
		});

		it("should return false if circle.name.trim() is size 0", function() {
			var circle = {name: '     '};
	    	var saved = CircleService.saveCircle(circle);
	    	expect(saved).toBe(false);
		});

		it("should update the circle in circles array if _id is present", function() {
			CircleService.getCircles();
			$httpBackend.flush();

			var circle = {"name":"Friends Updated", "_id":"543001ac79315f1341d33abe"};
	    	CircleService.saveCircle(circle);
	    	$httpBackend.flush();
	    	
	    	var c = CircleService.getCircle('543001ac79315f1341d33abe');
	    	expect(c).not.toBe(undefined);
	    	expect(c.name).toBe('Friends Updated');
		});

		it("should add the circle in circles array if _id is not present", function() {
			CircleService.getCircles();
			$httpBackend.flush();

			var circle = {"name":"Test"};
	    	CircleService.saveCircle(circle);
	    	$httpBackend.flush();
	    	
	    	var c = CircleService.getCircle('543001ac79315f1341d33abf');
	    	expect(c).not.toBe(undefined);
	    	expect(c.name).toBe('Test');
		});

	});

	/**
	 * deleteCircle(id)
	 */
	describe("deleteCircle function", function() {

		it("should return false if id is null", function() {
	    	var deleted = CircleService.deleteCircle(null);
	    	expect(deleted).toBe(false);
		});

		it("should remove the circle from circles array", function() {
			CircleService.getCircles();
			$httpBackend.flush();

			// CircleService.deleteCircle('543001ac79315f1341d33abe');   	
			// $httpBackend.flush();
			expect(true).toBe(false);

		});		

	});
});