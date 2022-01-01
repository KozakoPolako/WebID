import express, { Router, Request, Response } from "express";
import dowod from "./dowodPL"
import paszport from "./paszportPL"
const router = express.Router();

router.use("/pl/dowod",dowod);
router.use("/pl/paszport",paszport);

export default router;
