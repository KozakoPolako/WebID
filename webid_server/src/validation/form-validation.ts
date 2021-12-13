import { Dowod } from "../rec/dowodOsoistyPL";
import getDowodRules from "./dowodRules";

type Data = Record<string,string>

export type ValidationRules =  ((v:string) => boolean | string)[];




export default class FormValidation {
  static validate<T extends Data>(obj: T, rules: Record<keyof T, ValidationRules>): boolean | string[] {
    const errors: string[] = [];
    for (const key in obj) {
      for (const func in rules[key]) {
        const rule: (v: string) => boolean | string = rules[key][func];
        if (!rule) throw new Error("ValidationError:Invalid rules Function");
        const results = rule(obj[key]);
        if (typeof results === "string") {
          errors.push( `${key}: ${results}`);
        }
      }
    }

    return errors.length ? errors : true;
  }
  static validateDowod(dowod: Dowod): boolean | string[] {
    const dowodRules = getDowodRules();
    return this.validate(dowod, dowodRules);
  }
}
