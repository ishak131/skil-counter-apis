const express = require('express');
const fs = require("fs");
const uploadRouter = express.Router();
const FileType = require('file-type');
const User = require('../schemas/user');
const { authinticate } = require('./auth');
const uploadWithStorage = require('./uploadImages/multerSetup')

function errorHandler(error, req, res, next) {
    if (error) {
        return res.status(406).send({ error: error.message });
    } next();
};

uploadRouter.post('/uploadAvatar', authinticate, uploadWithStorage.single("avatar"), errorHandler, async (req, res) => {
    try {
        const {
            file,
            user
        } = req
        const imagePath = `${__dirname}/../public/profileImages/${file.filename}`
        const { mime } = await FileType.fromFile(imagePath);
        if (!mime.includes('image/')) {
            fs.unlink(imagePath);
            throw new Error('Only .png, .jpg and .jpeg format allowed!');
        }
        if (user.imagePath) {
            fs.unlink(`${__dirname}/../public/profileImages/${user.imagePath}`, async (err) => {
                if (err)
                    await User.findByIdAndUpdate(user._id, { $unset: { imagePath: 1 } });
            });
        }
        await User.findByIdAndUpdate(user._id, { imagePath: file.filename });
        res.send({ avatarImage: file })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})
////////////////////////////////////////////////////////////////


uploadRouter.get('/getAvatar', authinticate, (req, res) => {
    try {
        const { imagePath } = req.user
        res.send({ imagePath });
    } catch (error) {
        res.send({ error })
    }

});

/*
    uploadRouter.get('/', function (req, res, next) {
        res.render('index', { title: 'Express' });
    });
*/

module.exports = uploadRouter;
