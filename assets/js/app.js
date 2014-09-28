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
