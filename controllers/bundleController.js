const Item = require('../models/Item');
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
	const allItems = await Item.find().exec();

	res.render('bundle_form', {
		title: 'Create a new bundle',
		item_list: allItems,
	});
});

exports.bundle_create_post = [
	// Convert the item to an array.
	(req, res, next) => {
		if (!(req.body.item instanceof Array)) {
			if (typeof req.body.item === 'undefined') req.body.item = [];
			else req.body.item = new Array(req.body.item);
		}
		next();
	},
	// Validate and sanitize fields.
	body('name', 'Name must be at least 2 characters.')
		.trim()
		.isLength({ min: 2 })
		.escape(),
	body('item', 'must contain at least 2 item')
		.custom((value) => value.length > 1)
		.escape(),
	body('discount', 'must enter a discount')
		.trim()
		.notEmpty()
		.if(body('discount').notEmpty())
		.isInt({ gt: 0 })
		.withMessage('discount must be larger than zero.')
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const bundleDetail = {
			name: req.body.name,
			items: req.body.item,
			discount: req.body.discount,
		};
		if (req.body.description)
			bundleDetail.description = req.body.description;
		if (req.body.image) bundleDetail.image = req.body.image;
		const bundle = new Bundle(bundleDetail);

		if (!errors.isEmpty()) {
			const allItems = await Item.find().exec();

			for (const item of allItems) {
				if (bundle.items.indexOf(item._id) > -1) {
					item.checked = 'true';
				}
			}

			res.render('bundle_form', {
				title: 'Create a new bundle',
				item_list: allItems,
				bundle: bundle,
				errors: errors.array(),
			});
		} else {
			await bundle.save();
			res.redirect(bundle.url);
		}
	}),
];

exports.bundle_update_get = asyncHandler(async (req, res, next) => {
	const [bundle, allItems] = await Promise.all[
		(Bundle.findById(req.params.id), Item.find().exec())
	];

	if (bundle === null) {
		// No results.
		const err = new Error('Bundle not found');
		err.status = 404;
		return next(err);
	}

	res.render('bundle_form', {
		title: 'Create a new bundle',
		item_list: allItems,
		bundle: bundle,
	});
});
