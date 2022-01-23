import session from "express-session";
import Keycloak, { KeycloakConfig } from "keycloak-connect";

// let _keycloak: Keycloak.Keycloak;

const keycloakConfig = {
  clientId: "webid-server",
  bearerOnly: true,
  serverUrl: "http://localhost:8070/auth",
  realm: "WebID",
  realmPublicKey: process.env.REALM_PUBLIC_KEY
};

 class KeycloacConfig {
  memoryStore = new session.MemoryStore();
  _keycloak: Keycloak.Keycloak | undefined;

  constructor() {
    this.initKeycloak();
  }
  initKeycloak() {
    if (this._keycloak) {
      console.warn("Trying to init Keycloak again!");
    } else {
      console.log("Initializing Keycloak...");
      //const memoryStore = new session.MemoryStore();
      //@ts-ignore
      this._keycloak = new Keycloak({ store: this.memoryStore }, keycloakConfig);
    }
  }
  getKeycloak(): Keycloak.Keycloak | undefined {

    if (!this._keycloak) {
      console.error(
        "Keycloak has not been initialized. Please called init first."
      );
      return undefined;
    } else return this._keycloak;
  }
}

export default new KeycloacConfig();