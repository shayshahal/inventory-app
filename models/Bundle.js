const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BundleSchema = new Schema({
	name: { type: String, required: true },
	items: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
	discount: { type: Number, required: true },
	description: { type: String },
	image: { type: String },
});

BookInstanceSchema.virtual('url').get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/bundle/${this._id}`;
});

module.exports = mongoose.model('Bundle', BundleSchema);
