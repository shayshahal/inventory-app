const Bundle = require('../models/Bundle');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.bundle_list = asyncHandler(async (req, res, next) => {
	const allBundles = await Bundle.find().sort({ name: 1 }).exec();
	res.render('bundle_list', {
		title: 'Bundle List',
		bundle_list: allBundles,
	});
});

exports.bundle_detail = asyncHandler(async (req, res, next) => {
	const bundle = await Bundle.findById(req.params.id)
		.populate('items')
		.exec();
	if (bundle === null) {
		// No results.
		const err = new Error('bundle not found');
		err.status = 404;
		return next(err);
	}

	res.render('bundle_detail', {
		bundle: bundle,
	});
});

exports.bundle_create_get = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find();

	res.render('bundle_form', {
		title: 'Create a new bundle',
		item_list: allItems,
	});
});

