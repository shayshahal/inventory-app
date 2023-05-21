const Item = require('../models/Item');
const Bundle = require('../models/Bundle');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.item_list = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find().sort({ name: 1 }).exec();
	res.render('item_list', {
		title: 'Item List',
		item_list: allItems,
	});
});

exports.item_detail = asyncHandler(async (req, res, next) => {
	const [item, bundlesWithItem] = await Promise.all([
		Item.findById(req.params.id).populate('categories').exec(),
		Bundle.find({ items: req.params.id }).exec(),
	]);

	if (item === null) {
		// No results.
		const err = new Error('Item not found');
		err.status = 404;
		return next(err);
	}

	res.render('item_detail', {
		item: item,
		bundle_list: bundlesWithItem,
	});
});
