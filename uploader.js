const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg')
			cb(null, true);
		else cb('file has to be png/jpg', false);
	},
});

module.exports = upload;
