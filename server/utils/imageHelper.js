var fs = require('fs');
var crypto = require('crypto');
var easyimage = require('easyimage');
var rimraf = require('rimraf');

exports.imageHelper = (function() {
	var uploadPath = '/var/www/static/circlr/img';

	return {
		getUploadPath: function() {
			return uploadPath;
		},

		createHash: function(length, callback) {
			crypto.randomBytes(length/2, function(ex, hash) {
				if (ex) {
					callback(ex);
				}

				if (hash) {
					callback(null, hash.toString('hex'));
				}
				else {
					callback(new Error('Problem when generating hash'));
				}
			});
		},

		createFolder: function(path, callback) {
			fs.mkdir(path, function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null);	
				}
			});
		},

		createThumbnail: function(src, dest, callback) {
			easyimage.thumbnail({
            	src:src, dst:dest,
            	width:256, height:256,
            	x:0, y:0
	        }).then(function (file) {
	            callback(null);
	        });
		},

		copyImage: function(src, dest, callback) {
			easyimage.resize({
				src:src, 
				dst:dest, 
				width:1920, 
				height:1080, 
				quality: 80
			}).then(function (file) {
            	callback(null);
        	});
		},

		getExtension: function(type) {
			if (type && type === 'image/jpeg') {
				return '.jpg';
			} else {
				return '.jpg';
			}
		},

		deleteFolderAndImages: function(folder, callback) {
			if (folder) {
				rimraf(folder, callback);
			}
			else {
				callback(new Error('folder undefined'));
			}
		}
	};
})();