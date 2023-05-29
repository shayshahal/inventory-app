var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const bundleController = require('../controllers/bundleController');

/* GET home page. */
router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		res.render('index', { title: 'Home' });
	})
);

// ITEM ROUTES //

router.get('/items', itemController.item_list);

router.get('/item/create', itemController.item_create_get);

router.post('/item/create', itemController.item_create_post);

// router.get('/item/:id/update', itemController.item_update_get);

// router.post('/item/:id/update', itemController.item_update_post);

// router.get('/item/:id/delete', itemController.item_delete_get);

// router.post('/item/:id/delete', itemController.item_delete_post);

router.get('/item/:id', itemController.item_detail);

// CATEGORY ROUTES //

router.get('/categories', categoryController.category_list);

// router.get('/category/create', categoryController.category_create_get);

// router.post('/category/create', categoryController.category_create_post);

// router.get('/category/:id/update', categoryController.category_update_get);

// router.post('/category/:id/update', categoryController.category_update_post);

// router.get('/category/:id/delete', categoryController.category_delete_get);

// router.post('/category/:id/delete', categoryController.category_delete_post);

router.get('/category/:id', categoryController.category_detail);

// BUNDLES ROUTES //

router.get('/bundles', bundleController.bundle_list);

// router.get('/bundle/create', bundleController.bundle_create_get);

// router.post('/bundle/create', bundleController.bundle_create_post);

// router.get('/bundle/:id/update', bundleController.bundle_update_get);

// router.post('/bundle/:id/update', bundleController.bundle_update_post);

// router.get('/bundle/:id/delete', bundleController.bundle_delete_get);

// router.post('/bundle/:id/delete', bundleController.bundle_delete_post);

router.get('/bundle/:id', bundleController.bundle_detail);

module.exports = router;