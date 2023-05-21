const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	image: { type: String },
	stats: { type: Map, of: Number, required: true },
	categories: [
		{ type: Schema.Types.ObjectId, ref: 'Category', required: true },
	],
});

ItemSchema.virtual('url').get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
