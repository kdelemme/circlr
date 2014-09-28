var crypto = require('crypto');
var PhotoModel = require('../models/PhotoModel').PhotoModel;
var CircleModel = require('../models/CircleModel').CircleModel;
var imageHelper = require('../utils/imageHelper').imageHelper;

var LIMIT = 5;

exports.getPublicPhotos = function(req, res) {

	var offset = req.params.offset || 0;

	var query = PhotoModel.find({circles: {$size: 0}});

	query.select('img_url description circles');
	query.sort('-created');
	query.limit(LIMIT);
	query.skip(offset * LIMIT);
	query.exec(function(err, photos) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		if (photos) {
			return res.send(200, photos);
		} 
		else {
			return res.send(200, []);
		}
	});
}

exports.getAllPhotos = function(req, res) {
	var offset = req.params.offset || 0;

	var query = PhotoModel.find();
	
	query.select('_id thumb_url description circles');
	query.sort('-created');
	query.limit(LIMIT);
	query.skip(offset * LIMIT);
	query.exec(function(err, photos) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		if (photos != null) {
			return res.send(200, photos);
		} 
		else {
			return res.send(200, []);
		}
	});
}


exports.getPhotosByCircleKey = function(req, res) {
	var offset = req.params.offset || 0;
	var circleKey = req.params.circleKey;

	if (circleKey == null) {
		console.log('circleKey is null.');
		return res.send(400);
	}

	var query = CircleModel.findOne({circleKey: circleKey});
	query.select('_id name circleKey');
	query.exec(function(err, circle) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		// circle has been found, gets all photos from this circleId or with empty circles array (public)
		if (circle) {
			var circleId = circle._id;

			var queryPhoto = PhotoModel.find({ $or: [ {circles: circleId}, {circles: {$size: 0}} ] });
			queryPhoto.select('img_url description circles');
			queryPhoto.sort('-created');
			queryPhoto.limit(LIMIT);
			queryPhoto.skip(offset * LIMIT);
			queryPhoto.exec(function(err, photos) {
				if (err) {
					console.log(err);
					return res.send(500);
				}

				if (photos) {
					return res.send(200, photos);
				} else {
					return res.send(200, []);
				}
			});

		} else {
			return res.send(400);
		}
	});
}

exports.uploadPhotos = function(req, res) {
	var file = req.files.file;

	var HASH_LENGTH = 64;
	var SEP = '/';

	// file.path is a temporary path
	// generate hash
	// copy file.path to img/hash/img.jpg
	// create thumbnail: img/hash/img_thumb.jpg
	// store in mongoDB: img/hash/img.jpg, img/hash/img_thumb.jpg
	// create redirection: static.kdelemme.com/circlr/hash/img.jpg to point to img/hash/img.jpg

	imageHelper.createHash(HASH_LENGTH, function(err, hash) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		if (hash.length != HASH_LENGTH) {
			return res.send(500);
		}

		var uploadFolderName = hash.substring(0,48);
		var uploadFileName = hash.substring(48);

		var uploadPath = imageHelper.getUploadPath();
		uploadPath = uploadPath + SEP + uploadFolderName;

		// creates final directory
		imageHelper.createFolder(uploadPath, function(err) {
			if (err) {
				console.log(err);
				return res.send(500);
			}

			var extension = imageHelper.getExtension(file.type);
			var thumbnailDest = uploadPath + SEP + uploadFileName + '_thumb' + extension;
			var imageDest = uploadPath + SEP + uploadFileName + extension;

			// copies and resizes tmp photo to final directory
			imageHelper.copyImage(file.path, imageDest, function(err) {
				if (err) {
					console.log(err);
					return res.send(500);
				}

				// creates thumbnail
				imageHelper.createThumbnail(imageDest, thumbnailDest, function(err) {
					if (err) {
						console.log(err);
						return res.send(500);
					}

					// Saves photo
					var photo = new PhotoModel();
					photo.img_url = uploadFolderName + SEP + uploadFileName + extension;
					photo.thumb_url = uploadFolderName + SEP + uploadFileName + '_thumb' + extension;

					photo.save(function(err) {
						if (err) {
							console.log(err);
							return res.send(500);
						}

						return res.send(200, photo);
					});
				});
			});
		});
	});
}

exports.updatePhoto = function(req, res) {
	var photoId = req.params.id;

	if (photoId == null) {
		console.log('photoId is null');
		return res.send(400);
	}

	var description = req.body.description;

	if (description == null || description.trim().length == 0) {
		console.log('Description is null or empty');
		return res.send(400);
	}

	PhotoModel.update({_id: photoId}, { $set : { description: description }}, function(err, nbRows, raw) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		return res.send(200);
	});
}

exports.updateCircles = function(req, res) {
	var photoId = req.params.id;

	if (photoId == null) {
		console.log('photoId is null');
		return res.send(400);
	}

	var circles = req.body.circles || [];

	PhotoModel.update({_id: photoId}, { $set : { circles: circles }}, function(err, nbRows, raw) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		return res.send(200);
	});
}

exports.deletePhoto = function(req, res) {
	var photoId = req.params.id;

	if (photoId == null) {
		console.log('photoId is null');
		return res.send(400);
	}

	var query = PhotoModel.findOne({_id: photoId});
	query.exec(function(err, photo) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		if (photo) {
			// gets /path/to/upload/folder/imageFolderHash
			var folderImage = imageHelper.getUploadPath() + '/' + photo.img_url.substring(0, photo.img_url.indexOf('/'));

			imageHelper.deleteFolderAndImages(folderImage, function(err) {
				if (err) {
					console.log(err);
					return res.send(500);
				}

				photo.remove();
				return res.send(200);
				
			});
		} else {
			return res.send(400);
		}		
	});
}