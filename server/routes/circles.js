var CircleModel = require('../models/CircleModel').CircleModel;
var PhotoModel = require('../models/PhotoModel').PhotoModel;
var crypto = require('crypto');

exports.getCircles = function(req, res) {
	var query = CircleModel.find();

	query.select('_id name circleKey');
	query.exec(function(err, circles) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		return res.send(200, circles);
	});
}

exports.getCircle = function(req, res) {
	var id = req.params.id;

	if (id == null) {
		return res.send(400);
	}

	var query = CircleModel.findOne({_id:id});
	query.select('_id name circleKey');
	query.exec(function(err, circle) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		return res.send(200, circle);
	});
};

exports.createCircle = function(req, res) {
	var circle = req.body;

	if (circle == null || circle.name == null) {
		console.log('circle or circle.name is null');
		return res.send(400);
	}

	var newCircle = new CircleModel();
	newCircle.name = circle.name;

	try {
		var buf = crypto.randomBytes(24).toString('hex');
		newCircle.circleKey = buf;
	} catch (ex) {
		console.log(ex);
	  	return res.send(500);
	}

	newCircle.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		return res.send(200, newCircle);
	});
}


exports.deleteCircle = function(req, res) {
	var id = req.params.id;

	var query = CircleModel.findOne({_id: id});
	query.exec(function(err, circle) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		if (circle) {

			// deletes circle._id from all photos.circles array
			PhotoModel.update(
				{ circles: id }, 
				{ $pull: { circles: id } },
				{ multi: true },
				function(err, nbRows, raw) {

					if (err) {
						console.log(err);
						return res.send(500);
					}

					circle.remove();
					return res.send(200);
				}
			);
		}
		else {
			return res.send(400);
		}
	});
};

exports.editCircle = function(req, res) {
	var id = req.params.id;
	var circle = req.body;

	if (id == null || circle == null || circle.name == null) {
		console.log('id, circle or circle.name is null');
		return res.send(400);
	}

	CircleModel.update({_id: id}, { $set : {name: circle.name} }, function(err, nbRows, raw) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

		if (nbRows == 0) {
			console.log('no circle updated with id: ' + id);
			return res.send(400);
		}
		else {
			return res.send(200);
		}

	});
};