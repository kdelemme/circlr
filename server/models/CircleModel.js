var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Circle Schema
var CircleSchema = new Schema({
	name: { type: String, required: true, unique: true },
	circleKey: { type: String, required: true, unique: true },
	created: { type: Date, default: Date.now }
});

// Export Circle Model
exports.CircleModel = mongoose.model('circles', CircleSchema);