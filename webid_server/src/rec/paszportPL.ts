import { destructDocument } from "./documentDestructor";
import { performance } from "perf_hooks";
import PaszportWorkers from "./paszportWorkers"
import path from "path";

export type Paszport = {
  names: string;
  surname: string;
  birthDate: string;
  sex: string;
  id: string;
  type: string;
  code: string;
  pesel: string;
  nationality: string;
  birthPlace: string;
  issueDate: string;
  issuingAuthority: string;
  expiryDate: string;
  MRZ: string;
};

const Workers = new PaszportWorkers()

export default class PaszportPL {
  static async getDocumentFromPhoto(passport: string): Promise<Paszport> {
    const start = performance.now();
    try {
      await destructDocument(passport, "passport", true);

      const passportName = path.basename(passport);

      const paszport = await Workers.recognisePaszport(passportName);

      return paszport;
    } catch (e) {
      console.log(e);
      throw new Error(`PaszportParseError: ${e}`);
    } finally {
      const end = performance.now();
      console.log(`Rozpoznawanie trwało:  ${(end - start) / 1000} s`);
    }
  }
}
