import session from "express-session";
import Keycloak, { KeycloakConfig } from "keycloak-connect";

// let _keycloak: Keycloak.Keycloak;

const keycloakConfig = {
  clientId: "webid-server",
  bearerOnly: true,
  serverUrl: "http://localhost:8070/auth",
  realm: "WebID",
  realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj1Bd/B36MZK9doY6F4QhzjXxf4Hp7PC3KXxu8X51LmqI6LIQG1+f3qey2iyt9718+/WwZIn+pQAGtazP4QSJr0YTWdWmBZm7a/HdgjGCdJO/hA5lTu6+II6BMa253CNW9z0nA79wvtuUZXWssB+BQYuW7H06Iz9acMFiEmp97KkL6PoaQlGtWStZZQZn1Ri2kvb/OH1RWPdp1aeQnThXI4487BayIC1O3/N7F9mWAqJDS+wp+G5bqVaDqfsBcojrvw1kYoxM1EuG3o6ByT9HffvmzeuwD+xLRikqsbJ7TR9ed+zzCdaHMMbUhXcuBSMirlifwbFB4yRquYQBdveYzQIDAQAB'
};

 class KeycloacConfig {
  _keycloak: Keycloak.Keycloak | undefined;

  constructor() {
    this.initKeycloak();
  }
  initKeycloak() {
    if (this._keycloak) {
      console.warn("Trying to init Keycloak again!");
    } else {
      console.log("Initializing Keycloak...");
      var memoryStore = new session.MemoryStore();
      //@ts-ignore
      this._keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
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