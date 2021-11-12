import express, { Router, Request, Response } from "express"
import multer from "multer"
import DowodOsobistyPL from "../../../rec/dowodOsoistyPL";
import fs from "fs";

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
    limits: limits(10),
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

router.post('/pl/dowod', upload.array('dowodImage',2) , (req, res, next) => {
    console.log(req.files);
    
    if(req.files && req.files.length == 2){
        try {
            var files = [];
            var fileKeys = Object.keys(req.files);
            //const file = fs.readFileSync("D:\\OneDrive - Wojskowa Akademia Techniczna\\Obrazy\\Praca Inżynierska zdj\\Dowod-Osobisty-2015.jpg");
            // @ts-ignore 
            const temp = DowodOsobistyPL.getDocumentFromPhoto(req.files[0].path, req.files[1].path); 
        }catch(e) {
            console.log(e);
        }
        

        
    }
        

    res.status(200).json({
        message: 'dostałem posta'
    });
});

export default router;
