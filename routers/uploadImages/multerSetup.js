const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../public/profileImages`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "-" + file.originalname)
    }
})

const fileFilter = async (req, file, cb) => {  
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

module.exports = uploadWithStorage