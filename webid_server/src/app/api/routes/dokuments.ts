import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import DowodOsobistyPL from "../../../rec/dowodOsoistyPL";
import mkdirp from "mkdirp";
import fs from "fs";
import { Dowod } from "../../../rec/dowodOsoistyPL";
import { mongoController } from "../../app";
import FormValidation from "../../../validation/form-validation";

const router = express.Router();

const adress = "http://localhost:3000/api";

const storageDir = "./test/";

const jsonParser = bodyParser.json();

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
  const mongo = new mongoController();
  const document = await mongo.getDowod(req.params.docID);
  if (document) {
    switch (req.params.photo) {
      case "face":
        mongo.sendDowodPhotoByID(document.faceID, res);
        break;
      case "front":
        mongo.sendDowodPhotoByID(document.frontID, res);
        break;
      case "back":
        mongo.sendDowodPhotoByID(document.backID, res);
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
        const mongo = new mongoController();

        const record = await mongo.insertDocument(
          temp,
          frontfilename,
          backfilename
        );
        const recordID = record?.insertedId.toString();
        res.status(200).json({
          dowod: temp,
          id: recordID,
          faceURL: `${adress}/dokuments/pl/dowod/zdjecie/face/${recordID}`,
          frontURL: `${adress}/dokuments/pl/dowod/zdjecie/front/${recordID}`,
          backURL: `${adress}/dokuments/pl/dowod/zdjecie/back/${recordID}`,
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
// aktualizuj dokument
router.put("/pl/dowod/:docID", jsonParser, async (req, res, next) => {
  const dowod: Dowod = req.body;
  const validation = await FormValidation.validateDowod(dowod);

  if (typeof validation === "boolean") {
    try {
      const mongo = new mongoController();

      await mongo.updateDocument(dowod, req.params.docID);

      res.status(200).json({
        message: "Udało się zapisać dokument",
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        message: "Nie udało się zapisać dokumentu",
      });
    }
  } else {
    res.status(406).json({
      message: "Nieprawidłowo wypełniony formularz:",
      errors: validation,
    });
  }
});
// pobierz liste dokumentów
router.get("/pl/dowod", async (req, res, next) => {
  const mongo = new mongoController();
  const documents = await mongo.getDowods();
  if (documents) {
    const payload = documents.map((v) => {
      const id = v._id?.toString();
      return {
        id: id,
        frontURL: `${adress}/dokuments/pl/dowod/zdjecie/front/${id}`,
      };
    });
    res.status(200).json({
      _embeded: payload,
    });
  } else {
    res.status(404).json({
      message: "Nie znaleziono dokumentu",
    });
  }
});

// pobierz dokument
router.get("/pl/dowod/:docID", async (req, res, next) => {
  const mongo = new mongoController();
  const recordID = req.params.docID;
  const document = await mongo.getDowod(recordID);
  if (document) {
    const dowodData = document.dataHistory[document.dataHistory.length - 1];
    res.status(200).json({
      dowod: dowodData.documentData,
      id: recordID,
      faceURL: `${adress}/dokuments/pl/dowod/zdjecie/face/${recordID}`,
      frontURL: `${adress}/dokuments/pl/dowod/zdjecie/front/${recordID}`,
      backURL: `${adress}/dokuments/pl/dowod/zdjecie/back/${recordID}`,
    });
  } else {
    res.status(404).json({
      message: "Nie znaleziono dokumentu",
    });
  }
});

// usuń dokument
router.delete("/pl/dowod/:docID", async (req, res, next) => {
  const mongo = new mongoController();
  const recordID = req.params.docID;
  try {
    await mongo.deleteDowod(recordID);
    res.status(200).json({
      message: "Udało się usunąć dokument",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

export default router;
