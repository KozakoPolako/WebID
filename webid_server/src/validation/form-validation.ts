import { Dowod } from "../rec/dowodOsoistyPL";
import getDowodRules from "./dowodRules";

export default class FormValidation {
  static validate(obj: any, rules: any): boolean | string[] {
    const errors: string[] = [];
    for (const key in obj) {
      if (!rules.hasOwnProperty(key))
        throw new Error("ValidationError:Invalid rules Object");
    }

    for (const key in obj) {
      for (const func in rules[key]) {
        const rule: (v: string) => boolean | string = rules[key][func];
        if (!rule) throw new Error("ValidationError:Invalid rules Function");
        const results = rule(obj[key]);
        if (typeof results === "string") {
          errors.push(results);
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
