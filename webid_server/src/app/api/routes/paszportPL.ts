import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import PaszportPL from "../../../rec/paszportPL";
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

router.post("/", upload.single("paszportImage"), async (req,res,next) =>{
  if (req.file) {
    try {
      const temp = await PaszportPL.getDocumentFromPhoto (req.file.path)
      console.log("Skończyłem");
      console.dir(temp);
      res.status(200).json({
        message: "Udało się HURAAAA"
      })
    } catch(e) {
      console.log(e);
      res.status(404).json({
        message: "Nie udało się odczytać danych ze zdjęcia",
      });
    }
  }
})

export default router;