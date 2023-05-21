const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: { type: String, required: true, minLength: 2, maxLength: 100 },
	description: { type: String },
});

BookInstanceSchema.virtual('url').get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
