import Tesseract, { createWorker } from "tesseract.js";
import { Dowod } from "./dowodOsoistyPL";



class DowodWorkers {
  workers: Tesseract.Worker[] = [];
  dateRegex = /([0-2][0-9]|(3)[0-1])(\/|\.|\-|\ )(((0)[0-9])|((1)[0-2]))(\/|\.|\-|\ )\d{4}/
  LetersList = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ "
  NumberList = "1234567890"

  constructor() {
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
    console.log("dowodWorkers ready...")
  }
  prepareText(text:string) : string {
    let output = text.replace(/\n/g, " ");
    output = output.split(" ").filter(val => val.length >=3).join(" ")
    return output

  }
  prepareDate(date:string) : string {
    let matchArray = date.match(this.dateRegex)
    let output = matchArray ? matchArray[0] : ""
    output = output.replace(/ /g,".")
    let [day,mounth,year] = output.split(".")
    output = [mounth,day,year].join(".")
    return output 

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
      MRZ: "error",
    };

    const Jobs = [
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[0].setParameters({
            tessedit_char_whitelist: this.LetersList,
          });
          const {
            data: { text },
          } = await this.workers[0].recognize(
            "temporary/" + frontName.split(".")[0] + "/names.jpg"
          );
          dowod.names = this.prepareText(text);
          //await this.workers[0].terminate();
          resolve("namesDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[1].setParameters({
            tessedit_char_whitelist: this.LetersList,
          });
          const {
            data: { text },
          } = await this.workers[1].recognize(
            "temporary/" + frontName.split(".")[0] + "/surname.jpg"
          );
          dowod.surname = this.prepareText(text);
          //await this.workers[1].terminate();
          resolve("surnameDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[2].setParameters({
            tessedit_char_whitelist: this.LetersList,
          });
          const {
            data: { text },
          } = await this.workers[2].recognize(
            "temporary/" + frontName.split(".")[0] + "/familyname.jpg"
          );
          dowod.familyName = this.prepareText(text);
          //await this.workers[2].terminate();
          resolve("familyNameDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[3].setParameters({
            tessedit_char_whitelist: this.LetersList,
          });
          const {
            data: { text },
          } = await this.workers[3].recognize(
            "temporary/" + frontName.split(".")[0] + "/parentsname.jpg"
          );
          dowod.parentsNames = this.prepareText(text);
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
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[5].recognize(
            "temporary/" + frontName.split(".")[0] + "/birthdate.jpg"
          );
          // const temp = text.match(this.dateRegex)
          //  temp ? temp[0] : "";
          dowod.birthDate = this.prepareDate(text)
          //await this.workers[4].terminate();
          resolve("birthdateDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[6].setParameters({
            tessedit_char_whitelist: this.LetersList,
          });
          const {
            data: { text },
          } = await this.workers[6].recognize(
            "temporary/" + backName.split(".")[0] + "/birthplace.jpg"
          );
          dowod.birthPlace = this.prepareText(text);
          //await this.workers[4].terminate();
          resolve("birthplaceDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[7].recognize(
            "temporary/" + backName.split(".")[0] + "/expirydate.jpg"
          );
          // console.log("date: ", text)
          // console.log("match: ", text.match(this.dateRegex))
          // const temp = text.match(this.dateRegex)
          //  temp ? temp[0] : "";
          dowod.expiryDate = this.prepareDate(text)
          //await this.workers[4].terminate();
          resolve("expirydateDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[8].recognize(
            "temporary/" + backName.split(".")[0] + "/id.jpg"
          );
          dowod.id = text;
          //await this.workers[4].terminate();
          resolve("idDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[9].recognize(
            "temporary/" + backName.split(".")[0] + "/inssuingauthority.jpg"
          );
          dowod.issuingAuthority = this.prepareText(text);
          //await this.workers[4].terminate();
          resolve("inssuingauthorityDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[10].recognize(
            "temporary/" + backName.split(".")[0] + "/issuedate.jpg"
          );
          // const temp = text.match(this.dateRegex)
          //  temp? temp[0] : "";
          dowod.issueDate = this.prepareDate(text)
          //await this.workers[4].terminate();
          resolve("issuedateDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const {
            data: { text },
          } = await this.workers[11].recognize(
            "temporary/" + backName.split(".")[0] + "/MRZ.jpg"
          );
          dowod.MRZ = text;
          //await this.workers[4].terminate();
          resolve("MRZDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[12].setParameters({
            tessedit_char_whitelist: this.LetersList,
          });
          const {
            data: { text },
          } = await this.workers[12].recognize(
            "temporary/" + backName.split(".")[0] + "/nationality.jpg"
          );
          dowod.nationality = this.prepareText(text);
          //await this.workers[4].terminate();
          resolve("nationalityDone");
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          await this.workers[13].setParameters({
            tessedit_char_whitelist: this.NumberList,
          });
          const {
            data: { text },
          } = await this.workers[13].recognize(
            "temporary/" + backName.split(".")[0] + "/pesel.jpg"
          );
          dowod.pesel = text;
          //await this.workers[4].terminate();
          resolve("peselDone");
        } catch (error) {
          reject(error);
        }
      }),
      
    ];
    try {
      await Promise.all(Jobs);
    } catch (error) {
      console.error(error);
    } finally {
      return dowod;
    }
  }
}
export default DowodWorkers;

