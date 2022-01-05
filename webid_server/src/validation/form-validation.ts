import { parse } from "mrz";
import mongoController from "../mongoController/mongoController";
import { Dowod } from "../rec/dowodOsoistyPL";
import { Paszport } from "../rec/paszportPL";
import getDowodRules from "./dowodRules";
import getPaszportRules from "./paszportRules";

type Data = Record<string, string>;

export type ValidationRules = ((v: string) => boolean | string)[];

export default class FormValidation {
  static validate<T extends Data>(
    obj: T,
    rules: Record<keyof T, ValidationRules>
  ): boolean | string[] {
    const errors: string[] = [];
    for (const key in obj) {
      for (const func in rules[key]) {
        const rule: (v: string) => boolean | string = rules[key][func];
        if (!rule) throw new Error("ValidationError:Invalid rules Function");
        const results = rule(obj[key]);
        if (typeof results === "string") {
          errors.push(`${key}: ${results}`);
        }
      }
    }

    return errors.length ? errors : true;
  }

  ///////////////////////////////////////////////////////////////////////
  // Dowod 
  ///////////////////////////////////////////////////////////////////////
  static async validateDowod(dowod: Dowod): Promise<boolean | string[]> {
    const dowodRules = await getDowodRules();
    const firstStep = this.validate(dowod, dowodRules);
    const mongo = new mongoController();
    const currentRules = await mongo.getDowodValidateRules();

    const secondStep =
      currentRules && currentRules.isData_MRZValid
        ? await this._compareWithMRZ(dowod)
        : true;

    console.log(firstStep, "\n", secondStep);
    if (typeof firstStep === "boolean") {
      if (typeof secondStep === "boolean") {
        return true;
      } else {
        return secondStep;
      }
    } else if (typeof secondStep === "boolean") {
      return firstStep;
    } else {
      return firstStep.concat(secondStep);
    }
  }

  static async _compareWithMRZ(dowod: Dowod): Promise<boolean | string[]> {
    function usunPolskie(text: string): string {
      return text
        .replace(/ą/g, "a")
        .replace(/Ą/g, "A")
        .replace(/ć/g, "c")
        .replace(/Ć/g, "C")
        .replace(/ę/g, "e")
        .replace(/Ę/g, "E")
        .replace(/ł/g, "l")
        .replace(/Ł/g, "L")
        .replace(/ń/g, "n")
        .replace(/Ń/g, "N")
        .replace(/ó/g, "o")
        .replace(/Ó/g, "O")
        .replace(/ś/g, "s")
        .replace(/Ś/g, "S")
        .replace(/ż/g, "z")
        .replace(/Ż/g, "Z")
        .replace(/ź/g, "z")
        .replace(/Ź/g, "Z");
    }

    const errors: string[] = ["Niezgodność z sekcją MRZ:"];
    // replace(/[\s\\n]+/g,'')
    try {
      const res = parse(dowod.MRZ.trim().split("\n"));
      if (!res.valid) {
        return ["MRZ: Niepoprawna sekcja MRZ"];
      }
      if (
        res.fields.documentNumber?.replace(/[\s\\n]+/g, "") !=
        dowod.id.replace(/[\s\\n]+/g, "")
      ) {
        errors.push("- Numer dokumentu nie jest zgody z sekcją MRZ");
      }
      const birthDay = res.fields.birthDate?.match(/[0-9]{2}/g);
      if (
        !birthDay ||
        new Date(`${birthDay[1]}.${birthDay[2]}.${birthDay[0]}`).getTime() != new Date(dowod.birthDate).getTime()
      ) {
        errors.push("- Data urodzenia nie jest zgodna z sekcją MRZ");
      }

      if (
        (dowod.sex === "M" && res.fields.sex != "male") ||
        (dowod.sex === "K" && res.fields.sex != "female") ||
        !dowod.sex.match(/^[MK]$/)
      ) {
        errors.push("- Płeć nie jest zgodna z sekcją MRZ");
      }
      const expiryDay = res.fields.expirationDate
        ?.match(/[0-9]{2}/g)
      if (
        !expiryDay ||
        new Date(`${expiryDay[1]}.${expiryDay[2]}.${expiryDay[0]}`).getTime() != new Date(dowod.expiryDate).getTime()
      ) {
        
        errors.push("- Termin ważności nie jest zgodny z sekcją MRZ");
      }
      if (
        res.fields.optional2?.replace(/[\s\\n]+/g, "") !=
        dowod.pesel.replace(/[\s\\n]+/g, "")
      ) {
        errors.push("- Pesel nie jest zgodny z sekcją MRZ");
      }
      if (usunPolskie(res.fields.lastName?.replace(/[\s\\n]+/g,'') || "") != usunPolskie(dowod.surname.replace(/[\s\\n]+/g,''))) {
        errors.push("- Nazwisko nie jest zgodne z sekcją MRZ");
      }
      if (usunPolskie(res.fields.firstName?.replace(/[\s\\n]+/g,'') || "") != usunPolskie(dowod.names.replace(/[\s\\n]+/g,''))) {
        errors.push("- Imiona nie są zgodne z sekcją MRZ");
      }

    } catch {
      return ["MRZ: Niepoprawna sekcja MRZ"];
    }
    return errors.length > 1 ? errors : true;
  }
  ///////////////////////////////////////////////////////////////////////
  // Paszport
  ///////////////////////////////////////////////////////////////////////
  static async validatePassport(paszport: Paszport): Promise<boolean | string[]> {
    const paszportRules = await getPaszportRules();
    const firstStep = this.validate(paszport, paszportRules)
    return firstStep
    //TODO
  }
}
