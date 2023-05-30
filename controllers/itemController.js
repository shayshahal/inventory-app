const Item = require('../models/Item');
const Bundle = require('../models/Bundle');
const Category = require('../models/Category');
const upload = require('../uploader.js');
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

exports.item_create_get = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().exec();

	res.render('item_form', {
		title: 'Create a new item',
		categories: allCategories,
	});
});

exports.item_create_post = [
	upload.single('image'),
	// Convert the category to an array.
	(req, res, next) => {
		if (!(req.body.category instanceof Array)) {
			if (typeof req.body.category === 'undefined')
				req.body.category = [];
			else req.body.category = new Array(req.body.category);
		}
		next();
	},
	// Validate and sanitize fields.
	body('name', 'Name must be at least 2 characters.')
		.trim()
		.isLength({ min: 2 })
		.escape(),
	body('price', 'Must enter a price.')
		.trim()
		.notEmpty()
		.if(body('price').notEmpty())
		.isInt({ gt: 0 })
		.withMessage('Price must be larger than zero.')
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const itemDetail = {
			name: req.body.name,
			price: req.body.price,
			stats: {
				'Magic Power': req.body.magic_power,
				'Attack Damage': req.body.attack_damage,
				'Attack Speed': req.body.attack_speed,
				'Critical Strike Chance': req.body.crit_chance,
			},
			categories: req.body.category,
		};
		if (req.file) itemDetail.image = req.file.path;
		const item = new Item(itemDetail);

		if (!errors.isEmpty()) {
			const allCategories = await Category.find().exec();

			for (const category of allCategories) {
				if (item.categories.indexOf(category._id) > -1) {
					category.checked = 'true';
				}
			}

			res.render('item_form', {
				title: 'Create a new item',
				categories: allCategories,
				item: item,
				errors: errors.array(),
			});
		} else {
			await item.save();
			res.redirect(item.url);
		}
	}),
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
	const [item, allCategories] = await Promise.all([
		Item.findById(req.params.id),
		Category.find().exec(),
	]);

	if (item === null) {
		// No results.
		const err = new Error('item not found');
		err.status = 404;
		return next(err);
	}

	for (const category of allCategories) {
		if (item.categories.indexOf(category._id) > -1) {
			category.checked = 'true';
		}
	}

	res.render('item_form', {
		title: 'Update Item',
		categories: allCategories,
		item: item,
	});
});

exports.item_update_post = [
	upload.single('image'),
	// Convert the category to an array.
	(req, res, next) => {
		if (!(req.body.category instanceof Array)) {
			if (typeof req.body.category === 'undefined')
				req.body.category = [];
			else req.body.category = new Array(req.body.category);
		}
		next();
	},
	// Validate and sanitize fields.
	body('name', 'Name must be at least 2 characters.')
		.trim()
		.isLength({ min: 2 })
		.escape(),
	body('price', 'Must enter a price.')
		.trim()
		.notEmpty()
		.if(body('price').notEmpty())
		.isInt({ gt: 0 })
		.withMessage('Price must be larger than zero.')
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const itemDetail = {
			name: req.body.name,
			price: req.body.price,
			stats: {
				'Magic Power': req.body.magic_power,
				'Attack Damage': req.body.attack_damage,
				'Attack Speed': req.body.attack_speed,
				'Critical Strike Chance': req.body.crit_chance,
			},
			categories: req.body.category,
			_id: req.params.id,
		};
		if (req.file) itemDetail.image = req.file.path;
		const item = new Item(itemDetail);

		if (!errors.isEmpty()) {
			const allCategories = await Category.find().exec();

			for (const category of allCategories) {
				if (item.categories.indexOf(category._id) > -1) {
					category.checked = 'true';
				}
			}

			res.render('item_form', {
				title: 'Update item',
				categories: allCategories,
				item: item,
				errors: errors.array(),
			});
		} else {
			const updatedItem = await Item.findByIdAndUpdate(
				req.params.id,
				item
			);
			res.redirect(updatedItem.url);
		}
	}),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
	const [item, allBundlesWithItem] = await Promise.all([
		Item.findById(req.params.id).exec(),
		Bundle.find({ items: req.params.id }, 'name').exec(),
	]);

	if (item === null) {
		// No results.
		res.redirect('/items');
	}

	res.render('item_delete', {
		title: 'Delete item',
		item: item,
		bundle_list: allBundlesWithItem,
	});
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
	const [item, bundlesWithItem] = await Promise.all([
		Item.findById(req.params.id).exec(),
		Bundle.find({ items: req.params.id }).exec(),
	]);

	if (item === null) {
		// No results.
		res.redirect('/items');
	}
	if (bundlesWithItem.length > 0) {
		// Book has book_instances. Render in same way as for GET route.
		res.render('category_delete', {
			title: 'Delete Category',
			item: item,
			bundle_list: bundlesWithItem,
		});
	} else {
		await Item.findByIdAndRemove(req.params.id);
		res.redirect('/items');
	}
});
