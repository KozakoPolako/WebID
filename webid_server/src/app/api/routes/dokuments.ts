import express, { Router } from "express"
import multer from "multer"

const router = express.Router();

const storageDir = "./test/";

const storage = multer .diskStorage({
    destination(req,file,callback) {
        callback(null,storageDir);
    },
    filename(req,file,callback) {
        callback(null, Date.now() + file.originalname)
    }
})
const limits = (sizeMB:number) => {
    return {fileSize: 1024 * 1024 * sizeMB}
    
}


//type filefilter = Pick<multer.Options,"fileFilter">["fileFilter"]

const upload = multer({
    storage: storage, 
    limits: limits(6),
    fileFilter: (req, file, callback) => {
        if(file.mimetype.split("/")[0] === 'image'){
            callback(null, true);
        }else {
            callback(null, false);
        }
    }
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        message:"TODO"
    });
});

router.post('/pl/dowod', upload.single('dokumentImage'), (req, res, next) => {
    console.log(req.file);
    res.status(200).json({
        message: 'dostałem posta'
    });
});

export default router;
