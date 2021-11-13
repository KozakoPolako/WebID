import { Multer } from "multer";
import { spawn } from "child_process";
import Tesseract, { createWorker } from "tesseract.js";
import { destructDowod } from "./dowodDestructor"
import { resolve } from "path/posix";
import { rejects } from "assert";



enum Sex {
  Man,
  Woman,
}

class DowodOsobistyPL {
  id: string;
  surname: string;
  names: string[];
  parentsNames: string[];
  familyName: string;
  birthDate: Date;
  sex: Sex;
  pesel: number;
  nationality: string;
  birthPlace: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate: Date;

  constructor(
    id: string,
    surname: string,
    names: string[],
    parentsNames: string[],
    familyName:string,
    birthDate: Date,
    sex: Sex,
    pesel: number,
    nationality: string,
    birthPlace: string,
    issuingAuthority: string,
    issueDate: Date,
    expiryDate: Date
  ) {
    this.id = id;
    this.surname = surname;
    this.names = names;
    this.parentsNames = parentsNames;
    this.familyName = familyName;
    this.birthDate = birthDate;
    this.sex = sex;
    this.pesel = pesel;
    this.nationality = nationality;
    this.birthPlace = birthPlace;
    this.issuingAuthority = issuingAuthority;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
  }
  static async getDocumentFromPhoto(front: string, back: string): Promise<DowodOsobistyPL> {
    //console.log("front ", front, "back ", back);
    let names: string = "error"
    let surname: string = "error"
    let parentsNames: string = "error"
    let birthDate: string = "error"
    let familyName: string = "error"
    let sex: string = "error"
    let id: string = "error"
    let pesel: string = "error"
    let nationality: string = "error"
    let birthPlace: string = "error"
    let issueDate: string = "error"
    let issuingAuthority: string = "error"
    let expiryDate: string = "error"
    try {
      console.log("file: ", front)
      await destructDowod(front.toString(), "front")
      await destructDowod(back, "back")

      
      const frontName = front.split("\\")[1]
      const backName = back.split("\\")[1]
      console.log("test async")
      // 14 workerow
      // let workers: Tesseract.Worker[] = [];
      // for (let i = 0; i < 14; i++) {
      //   workers[i] = createWorker({
      //     logger: (m) => console.log("worker", i, ": ", m),
      //   });
      // }
      // // for (const worker in workers) {

      // // }
      // await Promise.all(workers.map(val => val.load()))
      // await Promise.all(workers.map(val => val.loadLanguage("pol")))
      // await Promise.all(workers.map(val => val.initialize("pol")))
      if (frontName && backName) {
        const Workers = [
          new Promise(async (resolve, reject) => {
            try {
              const worker = createWorker({
                logger: (m) => console.log("namesWorker: ", m),
              });
              await worker.load()
              await worker.loadLanguage("pol")
              await worker.initialize("pol")
              const { data: { text } } = await worker.recognize("temporary/" + frontName.split(".")[0] + "/names.jpg")
              names = text
              await worker.terminate();
              resolve("namesDone")
            } catch (error) {
              reject(error)
            }
          }),
          new Promise(async (resolve, reject) => {
            try {
              const worker = createWorker({
                logger: (m) => console.log("surnameWorker: ", m),
              });
              await worker.load()
              await worker.loadLanguage("pol")
              await worker.initialize("pol")
              const { data: { text } } = await worker.recognize("temporary/" + frontName.split(".")[0] + "/surname.jpg")
              surname = text
              await worker.terminate();
              resolve("surnameDone")
            } catch (error) {
              reject(error)
            }
          }),
          new Promise( async (resolve, reject) => {
            try {
              const worker = createWorker({
                logger: (m) => console.log("familyNameWorker: ", m),
              });
              await worker.load()
              await worker.loadLanguage("pol")
              await worker.initialize("pol")
              const { data: { text } } = await worker.recognize("temporary/" + frontName.split(".")[0] + "/familyname.jpg")
              familyName = text
              await worker.terminate();
              resolve("familyNameDone")
            } catch (error) {
              reject(error)
            }
          }),
          new Promise(async (resolve, reject) => {
            try {
              const worker = createWorker({
                logger: (m) => console.log("parentsNamesWorker: ", m),
              });
              await worker.load()
              await worker.loadLanguage("pol")
              await worker.initialize("pol")
              const { data: { text } } = await worker.recognize("temporary/" + frontName.split(".")[0] + "/parentsname.jpg")
              parentsNames = text
              await worker.terminate();
              resolve("parentsNameDone")
            } catch (error) {
              reject(error)
            }
          }),
          new Promise(async (resolve, reject) => {
            try {
              const worker = createWorker({
                logger: (m) => console.log("sexWorker: ", m),
              });
              await worker.load()
              await worker.loadLanguage("pol")
              await worker.initialize("pol")
              const { data: { text } } = await worker.recognize("temporary/" + frontName.split(".")[0] + "/sex.jpg")
              sex = text
              await worker.terminate();
              resolve("sexDone")
            } catch (error) {
              reject(error)
            }
          }),
        ]
        await Promise.all(Workers)
      }
      

      console.log("DONE")
      //   const worker = createWorker({
      //     logger: (m) => console.log(m),
      //   });
      //   await worker.load();
      //   await worker.loadLanguage("pol");
      //   await worker.initialize("pol");
      //   const {
      //     data: { text },
      //   } = await worker.recognize(front);
      //   await worker.terminate();
      //   console.log("Wynik: \n", text);
      } catch (e) {
        console.log(e);
      }

      return new DowodOsobistyPL(
        "01",
        surname,
        [names],
        [parentsNames],
        familyName,
        new Date(1998, 3, 19),
        Sex.Man,
        90233483353,
        "POLSKIE",
        "Warszawa",
        "PREZYDENT M.ST. WARSZAWY",
        new Date(2016, 6, 10),
        new Date(2026, 6, 10)
      );
    }
}

export default DowodOsobistyPL;
