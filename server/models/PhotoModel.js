var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Photo Schema
var PhotosSchema = new Schema({
	thumb_url: { type: String, required: true, unique: true },
	img_url: { type: String, required: true, unique: true },
	description: { type: String },
	circles: [ { type: Schema.ObjectId, unique: true } ],
	created: { type: Date, default: Date.now }
});

// Export Photo Model
exports.PhotoModel = mongoose.model('photos', PhotosSchema);