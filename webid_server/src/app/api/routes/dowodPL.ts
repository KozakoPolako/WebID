import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import DowodOsobistyPL from "../../../rec/dowodOsoistyPL";
import mkdirp from "mkdirp";
import fs from "fs";
import { Dowod } from "../../../rec/dowodOsoistyPL";
import { mongoController } from "../../app";
import FormValidation from "../../../validation/form-validation";
import Keycloak from "../../../auth/keycloak-config";
import { User } from "../../../auth/User";

const router = express.Router();

const keycloak = Keycloak.getKeycloak();

if (!keycloak) {
  throw new Error("Keycloak init error");
}

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

// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     message: "TODO",
//   });
// });
//pobierz zdjęcie z dowodu
router.get(
  "/zdjecie/:photo/:docID",
  keycloak.protect("user"),
  async (req, res, next) => {
    let authorized = true;
    if (req.token) {
      const user = new User(req.token);
      if (!((await user.isDowodOwner(req.params.docID)) || user.isAdmin)) {
        authorized = false;
      }
    } else {
      authorized = false;
    }
    if (authorized) {
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
    } else {
      res.status(401).json({
        message: "Brak uprawnień",
      });
    }
  }
);

// wysałanie dowodu do rozpoznania
router.post(
  "/",
  upload.array("dowodImage", 2),
  keycloak.protect("user"),
  async (req, res, next) => {

    if (!req.token) {
      res.status(401).json({
        message: "Brak uprawnień",
      });
    } else {
      const user = new User(req.token);
      if (req.files && req.files.length == 2) {
        try {
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

          const record = await mongo.insertDowod(
            user.ID,
            temp,
            frontfilename,
            backfilename
          );
          console.log(req.files)
          // @ts-ignore
          fs.rmSync(req.files[0].path,{ recursive: true, force: true })
          // @ts-ignore
          fs.rmSync(req.files[1].path,{ recursive: true, force: true })
          // @ts-ignore
          fs.rmdirSync(`./temporary/${req.files[0].filename.split(".")[0] }`, { recursive: true, force: true } )
          // @ts-ignore
          fs.rmdirSync(`./temporary/${req.files[1].filename.split(".")[0] }`, { recursive: true, force: true } )
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
  }
);
// aktualizuj dokument
router.put(
  "/:docID",
  jsonParser,
  keycloak.protect(),
  async (req, res, next) => {
    let authorized = true;
    if (req.token) {
      const user = new User(req.token);
      if (!((await user.isDowodOwner(req.params.docID)) || user.isAdmin)) {
        authorized = false;
      }
    } else {
      authorized = false;
    }
    if (authorized && req.token) {
      const user = new User(req.token);
      const dowod: Dowod = req.body;
      const validation = await FormValidation.validateDowod(dowod);

      if (typeof validation === "boolean") {
        try {
          const mongo = new mongoController();

          await mongo.updateDocument(dowod, req.params.docID, user.ID);

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
    } else {
      res.status(401).json({
        message: "Brak uprawnień",
      });
    }
  }
);
// pobierz liste dokumentów
router.get("/", keycloak.protect(), async (req, res, next) => {
  if (!req.token) {
    res.status(401).json({
      message: "Brak uprawnień",
    });
  } else {
    const mongo = new mongoController();
    const documents = await mongo.getDowods(new User(req.token));
    if (documents) {
      const payload = documents.map((v) => {
        const id = v._id?.toString();
        return {
          id: id,
          fullName: v.dataHistory[v.dataHistory.length - 1].documentData.surname + " " + v.dataHistory[v.dataHistory.length - 1].documentData.names,
          expairyDate: v.dataHistory[v.dataHistory.length - 1].documentData.expiryDate,
          docID: v.dataHistory[v.dataHistory.length - 1].documentData.id,
          frontURL: `${adress}/dokuments/pl/dowod/zdjecie/front/${id}`,
        };
      });
      res.status(200).json({
        _embeded: payload,
      });
    } else {
      res.status(404).json({
        message: "Nie znaleziono dokumentów",
      });
    }
  }
});

// pobierz dokument
router.get("/:docID", keycloak.protect(), async (req, res, next) => {
  let authorized = true;
  if (req.token) {
    const user = new User(req.token);
    if (!((await user.isDowodOwner(req.params.docID)) || user.isAdmin)) {
      authorized = false;
    }
  } else {
    authorized = false;
  }
  if (authorized) {
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
  } else {
    res.status(401).json({
      message: "Brak uprawnień",
    });
  }
});

// usuń dokument
router.delete("/:docID", keycloak.protect(), async (req, res, next) => {
  let authorized = true;
  if (req.token) {
    const user = new User(req.token);
    if (!((await user.isDowodOwner(req.params.docID)) || user.isAdmin)) {
      authorized = false;
    }
  } else {
    authorized = false;
  }
  if (authorized) {
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
  } else {
    res.status(401).json({
      message: "Brak uprawnień",
    });
  }
});

export default router;
