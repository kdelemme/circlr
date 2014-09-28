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
