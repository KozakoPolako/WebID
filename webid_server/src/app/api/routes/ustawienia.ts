import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoController, { DowodPLValidateRules } from "../../../mongoController/mongoController";

const router = express.Router();
const jsonParser = bodyParser.json();

// pobierz kryteria walidacji
router.get("/walidacja/dowod", async (req, res, next) => {
  const mongo = new mongoController();

  const rules = await mongo.getDowodValidateRules()

  if(rules) {
    res.status(200).json({
      rules: rules,
    });
  } else {
    res.status(404).json({
      message: "Nie udało się pobrać ustawnień walidacji",
    });
  }
});

// aktualizuj kryteria walidacji
router.put("/walidacja/dowod", jsonParser, async (req, res, next) => {
  try {
    const mongo = new mongoController();
    const newRules: DowodPLValidateRules = req.body;

    await mongo.setDowodValidateRules(newRules) 
    res.status(200).json({
      message: "Udało sie zapisać nowe ustawnienia walidacji"
    })
  } catch (error) {
    res.status(400).json({
      message: "Nie udao się zaktualizować ustawień"
    }) 
  }
});

export default router;
