const express = require('express');
const multer = require('multer');


const uploadRouter = express.Router();

/* GET home page. */
uploadRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../profileImages')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "-" + file.originalname)
    }
})

const upload = multer({ storage: storage })

uploadRouter.post('/uploadAvatar', upload.single('image'), (req, res) => {
    res.send('success')
})

module.exports = uploadRouter;
