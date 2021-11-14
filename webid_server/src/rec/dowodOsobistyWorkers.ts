import Tesseract, { createWorker } from "tesseract.js";
import DowodOsobistyPL from "./dowodOsoistyPL";

interface Dowod {
  names: string;
  surname: string;
  parentsNames: string;
  birthDate: string;
  familyName: string;
  sex: string;
  id: string;
  pesel: string;
  nationality: string;
  birthPlace: string;
  issueDate: string;
  issuingAuthority: string;
  expiryDate: string;
}

class DowodWorkers {
  workers: Tesseract.Worker[] = [];

  constructor() {
    console.log("constructor");
    this.prepareWorkers();
  }
  async prepareWorkers() {
    for (let i = 0; i < 14; i++) {
      this.workers[i] = createWorker({
        //logger: (m) => console.log("worker", i, ": ", m),
      });
    }
    await Promise.all(this.workers.map((val) => val.load()));
    for (let i = 0; i < 14; i++) {
      await this.workers[i].loadLanguage("pol");
      await this.workers[i].initialize("pol");
    }
    console.log("workers ready...")
  }
  async recogniseDowod(frontName: string, backName: string): Promise<Dowod> {
    const dowod: Dowod = {
      names: "error",
      surname: "error",
      parentsNames: "error",
      birthDate: "error",
      familyName: "error",
      sex: "error",
      id: "error",
      pesel: "error",
      nationality: "error",
      birthPlace: "error",
      issueDate: "error",
      issuingAuthority: "error",
      expiryDate: "error",
    };

    const Jobs = [
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[0].recognize(
            "temporary/" + frontName.split(".")[0] + "/names.jpg"
          );
          dowod.names = text;
          //await this.workers[0].terminate();
          resolve("namesDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[1].recognize(
            "temporary/" + frontName.split(".")[0] + "/surname.jpg"
          );
          dowod.surname = text;
          //await this.workers[1].terminate();
          resolve("surnameDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[2].recognize(
            "temporary/" + frontName.split(".")[0] + "/familyname.jpg"
          );
          dowod.familyName = text;
          //await this.workers[2].terminate();
          resolve("familyNameDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[3].recognize(
            "temporary/" + frontName.split(".")[0] + "/parentsname.jpg"
          );
          dowod.parentsNames = text;
          //await this.workers[3].terminate();
          resolve("parentsNameDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          // await this.workers[4].setParameters({
          //   tessedit_char_whitelist: "MK",
          // });
          const {
            data: { text },
          } = await this.workers[4].recognize(
            "temporary/" + frontName.split(".")[0] + "/sex.jpg"
          );
          dowod.sex = text;
          //await this.workers[4].terminate();
          resolve("sexDone");
        } catch (error) {
          reject(error);
        }
      }),
    ];
    try {
      console.log("workers work:dwdawdwa")
      await Promise.all(Jobs);
    } catch (error) {
      console.error(error);
    } finally {
      return dowod;
    }
  }
}
export default DowodWorkers;
