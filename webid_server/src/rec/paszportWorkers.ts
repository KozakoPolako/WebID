import Tesseract, { createWorker } from "tesseract.js";
import { Paszport } from "./paszportPL";

export default class PaszportWorkers {
  workers: Tesseract.Worker[] = [];
  constructor() {
    this.prepareWorkers();
  }
  async prepareWorkers() {
    for (let i = 0; i < 14; i++) {
      this.workers[i] = createWorker({});
    }
    await Promise.all(this.workers.map((val) => val.load()));
    for (let i = 0; i < 14; i++) {
      await this.workers[i].loadLanguage("pol");
      await this.workers[i].initialize("pol");
    }
    console.log("paszportWorkers ready...");
  }
  async recognisePaszport(passportName: string): Promise<Paszport> {
    const passport: Paszport = {
      names: "error",
      surname: "error",
      birthDate: "error",
      sex: "error",
      id: "error",
      type: "error",
      code: "error",
      pesel: "error",
      nationality: "error",
      birthPlace: "error",
      issueDate: "error",
      issuingAuthority: "error",
      expiryDate: "error",
      MRZ: "error",
    };

    return passport;
  }
}
