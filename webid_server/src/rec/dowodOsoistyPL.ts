import { Multer } from "multer";
import { spawn } from "child_process";
import Tesseract, { createWorker } from "tesseract.js";
import { destructDocument } from "./documentDestructor";
import { performance } from "perf_hooks"
import DowodWorkers from "./tesseractWorkers";
import path from "path";

export type Dowod = {
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
  MRZ: string;
}

enum Sex {
  Man,
  Woman,
}
const Workers = DowodWorkers; 
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
  ): Promise<Dowod> {
    const start = performance.now() 
    try {
      await destructDocument(front, "front", false);
      await destructDocument(back, "back", false);

      const frontName = path.basename(front);
      const backName = path.basename(back);
      
      const dowod = await Workers.recogniseDowod(frontName,backName);

      return dowod
    } catch (e) {
      console.log(e);
      throw new Error(`DowodParseError: ${e}`);
    } finally {
      const end  = performance.now() 
      console.log(`Rozpoznawanie trwa??o:  ${(end - start)/1000} s`);
    }
    
  }
}

export default DowodOsobistyPL;
