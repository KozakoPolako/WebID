//TODO

import { ValidationRules } from "./form-validation";
import { parse } from "mrz";
import mongoController from "../mongoController/mongoController";
import { Paszport } from "../rec/paszportPL";

export type PaszportRules = Record<keyof Paszport, ValidationRules>;

export default async function getPaszportRules(): Promise<PaszportRules> {
  const rules = await getCurrentPaszportRules();
  return rules
    ? rules
    : {
        names: [generalRules.required, generalRules.onlyLetters],
        surname: [generalRules.required, generalRules.onlyLetters],
        birthDate: [
          generalRules.required,
          generalRules.isDate,
          generalRules.isInFuture,
          paszportRules.birthDateRules.isAdults,
        ],
        sex: [generalRules.required, paszportRules.sexRules.sexCheck],
        id: [generalRules.required, paszportRules.idRules.controlCheck],
        type: [generalRules.required],
        code: [generalRules.required],
        pesel: [
          generalRules.required,
          paszportRules.peselRules.lengthCheck,
          paszportRules.peselRules.dateCheck,
          paszportRules.peselRules.controlCheck,
        ],
        nationality: [generalRules.required, generalRules.onlyLetters],
        birthPlace: [generalRules.required, generalRules.onlyLetters],
        issueDate: [
          generalRules.required,
          generalRules.isDate,
          //paszportRules.issueDateRules.isBeforeExpiry,
          paszportRules.issueDateRules.isInBuissnesDay,
          generalRules.isInFuture,
        ],
        issuingAuthority: [generalRules.required],
        expiryDate: [
          generalRules.required,
          generalRules.isDate,
          paszportRules.expiryDateRules.expiryCheck,
        ],
        MRZ: [generalRules.required, paszportRules.mrzRules.controlCheck],
      };
}

async function getCurrentPaszportRules(): Promise<PaszportRules | undefined> {
  const mongo = new mongoController();

  const currentRules = await mongo.getPaszportValidateRules();
  if (!currentRules) return undefined;
  return {
    names: [generalRules.required, generalRules.onlyLetters],
    surname: [generalRules.required, generalRules.onlyLetters],
    birthDate: currentRules.isAdultsOnly
      ? [
          generalRules.required,
          generalRules.isDate,
          generalRules.isInFuture,
          paszportRules.birthDateRules.isAdults,
        ]
      : [generalRules.required, generalRules.isInFuture],
    sex: [generalRules.required, paszportRules.sexRules.sexCheck],
    id: currentRules.isIDControl
      ? [generalRules.required, paszportRules.idRules.controlCheck]
      : [generalRules.required],
    type: [generalRules.required],
    code: [generalRules.required],
    pesel: currentRules.isPeselControl
      ? [
          generalRules.required,
          paszportRules.peselRules.lengthCheck,
          paszportRules.peselRules.dateCheck,
          paszportRules.peselRules.controlCheck,
        ]
      : [
          generalRules.required,
          paszportRules.peselRules.lengthCheck,
          paszportRules.peselRules.dateCheck,
        ],
    nationality: [generalRules.required, generalRules.onlyLetters],
    birthPlace: [generalRules.required, generalRules.onlyLetters],
    issueDate: currentRules.isIssueDateCorrect
      ? [
          generalRules.required,
          generalRules.isDate,
          //paszportRules.issueDateRules.isBeforeExpiry,
          paszportRules.issueDateRules.isInBuissnesDay,
          generalRules.isInFuture,
        ]
      : [generalRules.required, generalRules.isDate],
    issuingAuthority: [generalRules.required],
    expiryDate: currentRules.isNotExpired
      ? [
          generalRules.required,
          generalRules.isDate,
          paszportRules.expiryDateRules.expiryCheck,
        ]
      : [generalRules.required, generalRules.isDate],
    MRZ: currentRules.isMRZContol
      ? [generalRules.required, paszportRules.mrzRules.controlCheck]
      : [generalRules.required],
  };
}

const generalRules = {
  required: (v: string) => !!v || "Pole wymagane",
  isDate: (v: string) =>
    /^\d{4}(\-)(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])$/.test(v) ||
    "Wprowadź datę w formacie dd.mm.rrrr",
  onlyLetters: (v: string) =>
    /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]+$/.test(v) ||
    "Wprowadzono niedozwolone znaki",
  isInFuture: (v: string) =>
    new Date(v) < new Date() || "Data wydania nie może być z przyszłości",
};
const paszportRules = {
  namesRules: {},
  surnameRules: {},
  birthDateRules: {
    isAdults: (v: string) =>
      yearBetween(new Date(v)) >= 18 || "Musisz mieć 18 lat",
  },
  sexRules: {
    sexCheck: (v: string) => /[FM]/.test(v) || "F - Kobieta M - Mężczyzna",
  },
  idRules: {
    controlCheck: (v: string) =>
      isValidNumerPaszportu(v) || "Nieprawidłowy numer Paszportu",
  },
  typeRules: {},
  codeRules: {},
  peselRules: {
    lengthCheck: (v: string) =>
      /^[0-9]{11}$/.test(v) || "Numer Pesel musi zawierać 11 cyfr",
    dateCheck: (v: string) =>
      (parseInt(v.substring(4, 6)) <= 31 &&
        parseInt(v.substring(2, 4)) <= 12) ||
      "Nieprawidłowy numer Pesel", // sprawdzenie czy liczby zawiewierające rok urodzenia są poprawna datą
    controlCheck: (v: string) => {
      const digits = ("" + v).split("");
      let checksum =
        (1 * parseInt(digits[0]) +
          3 * parseInt(digits[1]) +
          7 * parseInt(digits[2]) +
          9 * parseInt(digits[3]) +
          1 * parseInt(digits[4]) +
          3 * parseInt(digits[5]) +
          7 * parseInt(digits[6]) +
          9 * parseInt(digits[7]) +
          1 * parseInt(digits[8]) +
          3 * parseInt(digits[9])) %
        10;
      if (checksum == 0) {
        checksum = 10;
      }
      checksum = 10 - checksum;
      return parseInt(digits[10]) === checksum || "Nieprawidłowy numer Pesel"; // sprawdzenie sumy kontrolnej
    },
  },
  nationalityRules: {},
  birthPlaceRules: {},
  issueDateRules: {
    isInBuissnesDay: (v: string) =>
      new Date(v).getDay() % 6 !== 0 ||
      "Dokument nie mógł zostać wydany w sobotę ani w niedzielę",
    // isBeforeExpiry: (v:string) =>
    //   !this.passport.expiryDate ||
    //   new Date(v) < new Date(this.passport.expiryDate) ||
    //   "Data wydania nie może być późniejsza niż termin ważności",
  },
  issuingAuthorityRules: {},
  expiryDateRules: {
    expiryCheck: (v: string) => {
      return (
        new Date(v).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ||
        "Data ważności dokumentu wygasła"
      );
    },
  },
  mrzRules: {
    controlCheck: (v: string) => {
      try {
        console.log("test : ", v)
        const res = parse(v.trim().split("\n"));
        console.log("sekcja MRZ: ",res);
        return res.valid || "Niepoprawna sekcja MRZ";
      } catch {
        return "Niepoprawna sekcja MRZ";
      }
    },
  },
};
function getValueFromLetter(letter: string) {
  const values = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  for (let i = 0; i < values.length; i++) {
    if (letter === values[i]) {
      return i;
    }
  }
  if (letter === "<") return 0;
  return -1;
}
function isValidNumerPaszportu(v: string) {
  const numerDigits = v.toUpperCase().replace(/ /g, "");
  let sum =
    (7 * getValueFromLetter(numerDigits[0]) +
      3 * getValueFromLetter(numerDigits[1]) +
      // 1 * this.getValueFromLetter(numerDigits[2]) +
      1 * getValueFromLetter(numerDigits[3]) +
      7 * getValueFromLetter(numerDigits[4]) +
      3 * getValueFromLetter(numerDigits[5]) +
      1 * getValueFromLetter(numerDigits[6]) +
      7 * getValueFromLetter(numerDigits[7]) +
      3 * getValueFromLetter(numerDigits[8])) %
    10;
  return sum === getValueFromLetter(numerDigits[2]);
}
function yearBetween(oldDate: Date): Number {
  const today = new Date();

  const yToday = today.getFullYear();
  const mToday = today.getMonth();
  const dToday = today.getDate();

  const yOld = oldDate.getFullYear();
  const mOld = oldDate.getMonth();
  const dOld = oldDate.getDate();

  let years = yToday - yOld;
  if (mOld > mToday) years--;
  else {
    if (mOld == mToday) {
      if (dOld > dToday) years--;
    }
  }
  return years;
}
