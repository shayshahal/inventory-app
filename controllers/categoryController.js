const Item = require('../models/Item');
const Category = require('../models/Category');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();
	res.render('category_list', {
		title: 'Category List',
		category_list: allCategories,
	});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
	const [category, itemsWithCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ categories: req.params.id }).exec(),
	]);

	if (category === null) {
		// No results.
		const err = new Error('category not found');
		err.status = 404;
		return next(err);
	}

	res.render('category_detail', {
		category: category,
		item_list: itemsWithCategory,
	});
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
	res.render('category_form', {
		title: 'Create a new category',
	});
});


exports.category_create_post = [
	// Validate and sanitize fields.
	body('name', 'Name must be at least 2 characters.')
		.trim()
		.isLength({ min: 2 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const categoryDetail = {
			name: req.body.name
		};
		if (req.body.description) categoryDetail.description = req.body.description;
		const category = new Category(categoryDetail);

		if (!errors.isEmpty()) {
			res.render('category_form', {
				title: 'Create a new category',
				category: category,
				errors: errors.array(),
			});
		} else {
			await category.save();
			res.redirect(category.url);
		}
	}),
];
