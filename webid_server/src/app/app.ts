import express, { Request, Response, Application } from "express";
import cors from "cors";
import dokuments from "./api/routes/documents";
import ustawienia from "./api/routes/ustawienia";
import mongoController from "../mongoController/mongoController";

const app: Application = express();

app.use(cors());
app.use(express.static('temporary/'))
app.use("/api/dokuments", dokuments);
app.use("/api/ustawienia", ustawienia);

export default app;
export { mongoController }
