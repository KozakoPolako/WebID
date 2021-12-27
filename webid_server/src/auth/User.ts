import jwtDecode from "jwt-decode";
import { mongoController } from "../app/app";

type KeycloakToken = {
  sub: string;
  resource_access: {
    "webid-client": {
      roles: string[];
    };
    "webid-server": {
      roles: string[];
    };
  };
};

export class User {
  ID: string;
  roles: string[];
  isAdmin = false;

  constructor(token: string) {
    const decoded = jwtDecode<KeycloakToken>(token);
    this.ID = decoded.sub;
    this.roles = decoded.resource_access["webid-server"]
      ? decoded.resource_access["webid-server"].roles
      : [];
    this.isAdmin = this.roles.includes("admin");
  }
  async isDowodOwner(docID: string): Promise<boolean> {
    const mongo = new mongoController();
    const res = await mongo.isDowodOwner(this.ID, docID);
    return res;
  }
}

// export function getUserID(token: string) {
//   const decoded = jwtDecode(token,{header: true })
//   return undefined
// }
