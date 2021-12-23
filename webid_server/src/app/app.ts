import express, { Request, Response, Application } from "express";
import cors from "cors";
import dokuments from "./api/routes/documents";
import ustawienia from "./api/routes/ustawienia";
import mongoController from "../mongoController/mongoController";
import Keycloak from "../config/keycloak-config"

console.log("jestem")
const keycloak = Keycloak.getKeycloak()
if (!keycloak) {
  throw new Error("Keycloak init error")
}

const app: Application = express();

app.use(keycloak.middleware())

app.use(cors());
app.use(express.static('temporary/'))
app.use("/api/dokuments", dokuments);
app.use("/api/ustawienia", ustawienia);

export default app;
export { mongoController }
