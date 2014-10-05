describe('Tests Photo Service', function() {

	var PhotoService;

	beforeEach(module('circlr'));
	beforeEach(
		inject(function(_PhotoService_, $injector) {
			PhotoService = _PhotoService_;
			$httpBackend = $injector.get('$httpBackend');



		})
	);

	describe('getPublicPhoto() should return 3 photos without circles', function() {

	});
});