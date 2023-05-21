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
