const express = require('express');
const router =  express.Router();
const multer = require('multer');

const storeDir = './WebID_Server/test/'

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, storeDir);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
})

const fileFiter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image'){
        cb(null, true);
    }else {
        cb(null, false);
    }
};
const limits = (sizeMB) => {
    return {fileSize: 1024 * 1024 * sizeMB}
    
}

const upload = multer({
    storage: storage, 
    limits: limits(6),
    fileFilter: fileFiter,
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'TODO'
    });
});

router.post('/pl/dowod', upload.single('dokumentImage'), (req, res, next) => {
    console.log(req.file);
    res.status(200).json({
        message: 'dostałem post '
    });
});

module.exports = router; 