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


module.exports = router;
