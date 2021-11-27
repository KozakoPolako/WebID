import express, { Router, Request, Response } from "express";
import multer from "multer";
import DowodOsobistyPL from "../../../rec/dowodOsoistyPL";
import mkdirp from "mkdirp";
import fs from "fs";
import { mongoController } from "../../app";

const router = express.Router();

const adress = "http://localhost:3000";

const storageDir = "./test/";

const storage = multer.diskStorage({
  async destination(req, file, callback) {
    let dir = storageDir;
    try {
      await mkdirp(dir);
      callback(null, dir);
    } catch {
      callback(new Error("Nie udało się utworzyć pliku"), dir);
    }
  },
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const limits = (sizeMB: number) => {
  return { fileSize: 1024 * 1024 * sizeMB };
};

//type filefilter = Pick<multer.Options,"fileFilter">["fileFilter"]

const upload = multer({
  storage: storage,
  limits: limits(10),
  fileFilter: (req, file, callback) => {
    if (file.mimetype.split("/")[0] === "image") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "TODO",
  });
});
//pobierz zdjęcie z dowodu
router.get("/pl/dowod/zdjecie/:photo/:docID", async (req, res, next) => {
  const document = await mongoController.getDowod(req.params.docID);
  if (document) {
    switch (req.params.photo) {
      case "face":
        mongoController.sendDowodPhotoByID(document.faceID, res);
        break;
      case "front":
        mongoController.sendDowodPhotoByID(document.frontID, res);
        break;
      case "back":
        mongoController.sendDowodPhotoByID(document.backID, res);
        break;
      default:
        res.status(400).json({
          message: "Nieprawidłowy Parametr",
        });
        break;
    }
  } else {
    res.status(404).json({
      message: "Nie znaleziono dokumentu",
    });
  }
});

// wysałanie dowodu do rozpoznania
router.post(
  "/pl/dowod",
  upload.array("dowodImage", 2),
  async (req, res, next) => {
    //console.log(req.files);

    if (req.files && req.files.length == 2) {
      try {
        var files = [];
        var fileKeys = Object.keys(req.files);
        //const file = fs.readFileSync("D:\\OneDrive - Wojskowa Akademia Techniczna\\Obrazy\\Praca Inżynierska zdj\\Dowod-Osobisty-2015.jpg");
        // @ts-ignore
        const temp = await DowodOsobistyPL.getDocumentFromPhoto(
          // @ts-ignore
          req.files[0].path,
          // @ts-ignore
          req.files[1].path
        );
        console.log("Skończyłem");
        console.dir(temp);
        // @ts-ignore
        const frontfilename = req.files[0].filename.split(".")[0];
        // @ts-ignore
        const backfilename = req.files[1].filename.split(".")[0];

        const record = await mongoController.insertDocument(
          temp,
          frontfilename,
          backfilename
        );
        const recordID = record?.insertedId.toString();
        res.status(200).json({
          dowod: temp,
          faceURL: `${adress}/dokuments/pl/dowod/zdjecie/face/${recordID}`,
          frontURL: `${adress}/dokuments/pl/dowod/zdjecie/front/${recordID}`,
          backURL: `${adress}/dokuments/pl/dowod/zdjecie/fback/${recordID}`,
        });
      } catch (e) {
        console.log(e);
        res.status(404).json({
          message: "Nie udało się odczytać danych ze zdjęcia",
        });
      }
    }
  }
);

export default router;
