#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/Item');
const Category = require('./models/Category');
const Bundle = require('./models/Bundle');

const items = [];
const categories = [];
const bundles = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await createCategories();
	await createItems();
	await createBundles();
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}

async function categoryCreate(name, description) {
	const categoryDetail = { name: name };
	if (description != false) categoryDetail.description = description;
	const category = new Category(categoryDetail);
	await category.save();
	categories.push(category);
	console.log(`Added category: ${name}`);
}

async function bundleCreate(name, items, discount, description, image) {
	const bundleDetail = {
		name: name,
		items: items,
		discount: discount,
	};
	if (description != false) bundleDetail.description = description;
	if (image != false) bundleDetail.image = image;

	const bundle = new Bundle(bundleDetail);
	await bundle.save();
	bundles.push(bundle);
	console.log(`Added bundle: ${name}`);
}

async function itemCreate(name, price, stats, categories, image) {
	itemDetail = {
		name: name,
		price: price,
		stats: stats,
		categories: categories,
	};
	if (image != false) itemDetail.image = image;

	const item = new Item(itemDetail);
	await item.save();
	items.push(item);
	console.log(`Added item: ${name}`);
}

async function createCategories() {
	console.log('Adding categories');
	await Promise.all([
		categoryCreate('Melee'),
		categoryCreate('Ranged'),
		categoryCreate('Magic'),
	]);
}

async function createItems() {
	console.log('Adding items');
	await Promise.all([
		itemCreate(
			'Sword',
			'55',
			{
				'Attack Damage': 25,
				'Attack Speed': 10,
				'Critical Strike Chance': 10,
			},
			[categories[0]]
		),
		itemCreate(
			'Bow',
			'30',
			{
				'Attack Damage': 10,
				'Attack Speed': 40,
				'Critical Strike Chance': 5,
			},
			[categories[1]]
		),
		itemCreate(
			'Sceptre',
			'40',
			{
				'Magic Damage': 40,
				'Attack Speed': 5,
				'Critical Strike Chance': 15,
			},
			[categories[1], categories[2]]
		),
	]);
}

async function createBundles() {
	console.log('Adding Bundles');
	await Promise.all([
		bundleCreate('Ranged Weapons', [items[1], items[2]], 20),
	]);
}
