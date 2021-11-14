import { Multer } from "multer";
import { spawn } from "child_process";
import Tesseract, { createWorker } from "tesseract.js";
import { destructDowod } from "./dowodDestructor";
import { performance } from "perf_hooks"
import dowodOsobistyWorkers from "./dowodOsobistyWorkers";
import path from "path";

enum Sex {
  Man,
  Woman,
}
const Workers = new dowodOsobistyWorkers(); 
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
    familyName: string,
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
  static async getDocumentFromPhoto(
    front: string,
    back: string
  ): Promise<DowodOsobistyPL> {
    const start = performance.now() 
    let names: string = "error";
    let surname: string = "error";
    let parentsNames: string = "error";
    let birthDate: string = "error";
    let familyName: string = "error";
    let sex: string = "error";
    let id: string = "error";
    let pesel: string = "error";
    let nationality: string = "error";
    let birthPlace: string = "error";
    let issueDate: string = "error";
    let issuingAuthority: string = "error";
    let expiryDate: string = "error";
    let MRZ :string = "error"
    try {
      console.log("file: ", front);
      await destructDowod(front.toString(), "front");
      await destructDowod(back, "back");


      const frontName = path.basename(front);
      const backName = path.basename(back);
      

      console.log("test async", frontName, " ", backName);
      const dowod = await Workers.recogniseDowod(frontName,backName);
      console.log();

      for (const key in dowod) {
        // @ts-ignore
        console.log(`${key}: \n ${dowod[key]}`) 
      }
      // console.log("names : " + dowod.names);
      // console.log("surname : " + dowod.surname);
      // console.log("familiname : " + dowod.familyName);
      // console.log("sex : " + dowod.sex);
      // console.log()
        
      
    } catch (e) {
      console.log(e);
    }
    
    const end  = performance.now() 
    console.log(`Rozpoznawanie trwało:  ${(end - start)/1000} s`);
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
