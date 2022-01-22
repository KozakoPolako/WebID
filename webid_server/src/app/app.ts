import express, { Request, Response, Application } from "express";
import cors from "cors";
import dokuments from "./api/routes/documents";
import ustawienia from "./api/routes/ustawienia";
import mongoController from "../mongoController/mongoController";
import Keycloak from "../auth/keycloak-config"
import session from "express-session";
import bearerToken from "express-bearer-token";

const keycloak = Keycloak.getKeycloak()
if (!keycloak) {
  throw new Error("Keycloak init error")
}


const app: Application = express();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: Keycloak.memoryStore
}));

app.use(keycloak.middleware())
app.use(bearerToken())
app.use(cors());
app.use("/api/dokuments", dokuments);
app.use("/api/ustawienia", ustawienia);

export default app;
export { mongoController }
