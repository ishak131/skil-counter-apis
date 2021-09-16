const express = require('express');
const multer = require('multer');
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const uploadRouter = express.Router();
const FileType = require('file-type');
const User = require('../schemas/user');
const { authinticate } = require('./auth');

/* GET home page. */


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../public/profileImages`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "-" + file.originalname)
    }
})

const fileFilter = async (req, file, cb) => {
    console.log(file);
    if (file.mimetype.includes('image/')) {
        req.file = file
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}

const uploadWithStorage = multer({
    storage,
    fileFilter
});

function errorHandler(error, req, res, next) {
    if (error)
        return res.status(406).send({ error: error.message });
    next();
};

uploadRouter.post('/uploadAvatar', authinticate, uploadWithStorage.single("avatar"), errorHandler, async (req, res) => {
    try {
        const {
            file,
            user
        } = req
        console.log(req);
        const imagePath = `${__dirname}/../public/profileImages/${file.filename}`
        const { mime } = await FileType.fromFile(imagePath);
        if (!mime.includes('image/')) {
            fs.unlink(imagePath, (err) => {
                throw new Error(err)
            });
            throw new Error('Only .png, .jpg and .jpeg format allowed!');
        }
        await User.findByIdAndUpdate(user._id, { imagePath })
        res.send({ avatarImage: file })
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message })
    }
})
////////////////////////////////////////////////////////////////
const upload = multer()
uploadRouter.post("/upload", upload.single("file"), async function (req, res, next) {
    try {
        const {
            file,
            body: { name }
        } = req;
        if (file.detectedFileExtension != ".jpg") next(new Error("Invalid file type"));
        const fileName = name + file.detectedFileExtension;
        await pipeline(
            file.stream,
            fs.createWriteStream(`${__dirname}/../public/profileImages/${fileName}`)
        );
        res.send("File uploaded as " + fileName);
    } catch (error) {
        console.log({ error });
    }

});

/*
    uploadRouter.get('/', function (req, res, next) {
        res.render('index', { title: 'Express' });
    });
*/

module.exports = uploadRouter;
