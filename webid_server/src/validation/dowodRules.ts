import DowodOsobistyPL, { Dowod } from "../rec/dowodOsoistyPL";
import { ValidationRules } from "./form-validation";
import { parse } from "mrz";
import mongoController from "../mongoController/mongoController";

export type DowodRules = Record<keyof Dowod, ValidationRules>;

export default async function getDowodRules(): Promise<DowodRules> {
  const rules = await getCurrentDowodRules();

  return rules
    ? rules
    : {
        names: [generalRules.required, generalRules.onlyLetters],
        surname: [generalRules.required, generalRules.onlyLetters],
        parentsNames: [generalRules.required, generalRules.onlyLetters],
        birthDate: [generalRules.required, generalRules.isInFuture],
        familyName: [generalRules.required, generalRules.onlyLetters],
        sex: [generalRules.required, dowodRules.sexRules.sexCheck],
        id: [generalRules.required, dowodRules.idRules.controlCheck],
        pesel: [
          generalRules.required,
          dowodRules.peselRules.lengthCheck,
          dowodRules.peselRules.dateCheck,
          dowodRules.peselRules.controlCheck,
        ],
        nationality: [generalRules.required, generalRules.onlyLetters],
        birthPlace: [generalRules.required, generalRules.onlyLetters],
        issueDate: [
          generalRules.required,
          generalRules.isDate,
          dowodRules.issueDateRules.isInBuissnesDay,
          generalRules.isInFuture,
        ],
        issuingAuthority: [generalRules.required],
        expiryDate: [
          generalRules.required,
          generalRules.isDate,
          dowodRules.expiryDateRules.expiryCheck,
        ],
        MRZ: [generalRules.required, dowodRules.mrzRules.controlCheck],
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

const dowodRules = {
  namesRules: {},
  surnameRules: {},
  parentsNamesRules: {},
  birthDateRules: {
    isAdults: (v: string) =>
      yearBetween(new Date(v)) >= 18 || "Musisz mieć 18 lat",
  },
  familyNameRules: {},
  sexRules: {
    sexCheck: (v: string) => /[KM]/.test(v) || "K - Kobieta M - Mężczyzna",
  },
  idRules: {
    controlCheck: (v: string) =>
      isValidSeriaDowodu(v) || "Nieprawidłowy numer dowodu",
  },
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
    //   !this.dowod.expiryDate ||
    //   new Date(v) < new Date(this.dowod.expiryDate) ||
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
        const res = parse(v.trim().split("\n"));
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
  return -1;
}
function isValidSeriaDowodu(v: string) {
  const seriaDigits = v.toUpperCase().replace(/ /g, "");
  console.log("seriaTrim :", seriaDigits);
  let sum =
    (7 * getValueFromLetter(seriaDigits[0]) +
      3 * getValueFromLetter(seriaDigits[1]) +
      1 * getValueFromLetter(seriaDigits[2]) +
      7 * getValueFromLetter(seriaDigits[4]) +
      3 * getValueFromLetter(seriaDigits[5]) +
      1 * getValueFromLetter(seriaDigits[6]) +
      7 * getValueFromLetter(seriaDigits[7]) +
      3 * getValueFromLetter(seriaDigits[8])) %
    10;
  return sum === getValueFromLetter(seriaDigits[3]);
}

async function getCurrentDowodRules(): Promise<DowodRules | undefined> {
  const mongo = new mongoController();

  const currentRules = await mongo.getDowodValidateRules();
  if (!currentRules) return undefined;
  return {
    names: [generalRules.required, generalRules.onlyLetters],
    surname: [generalRules.required, generalRules.onlyLetters],
    parentsNames: [generalRules.required, generalRules.onlyLetters],
    birthDate: currentRules.isAdultsOnly
      ? [
          generalRules.required,
          generalRules.isInFuture,
          dowodRules.birthDateRules.isAdults,
        ]
      : [generalRules.required, generalRules.isInFuture],
    familyName: [generalRules.required, generalRules.onlyLetters],
    sex: [generalRules.required, dowodRules.sexRules.sexCheck],
    id: currentRules.isIDControl
      ? [generalRules.required, dowodRules.idRules.controlCheck]
      : [generalRules.required],
    pesel: currentRules.isPeselControl
      ? [
          generalRules.required,
          dowodRules.peselRules.lengthCheck,
          dowodRules.peselRules.dateCheck,
          dowodRules.peselRules.controlCheck,
        ]
      : [
          generalRules.required,
          dowodRules.peselRules.lengthCheck,
          dowodRules.peselRules.dateCheck,
        ],
    nationality: [generalRules.required, generalRules.onlyLetters],
    birthPlace: [generalRules.required, generalRules.onlyLetters],
    issueDate: currentRules.isIssueDateCorrect
      ? [
          generalRules.required,
          generalRules.isDate,
          dowodRules.issueDateRules.isInBuissnesDay,
          generalRules.isInFuture,
        ]
      : [generalRules.required, generalRules.isDate],
    issuingAuthority: [generalRules.required],
    expiryDate: currentRules.isNotExpired
      ? [
          generalRules.required,
          generalRules.isDate,
          dowodRules.expiryDateRules.expiryCheck,
        ]
      : [generalRules.required, generalRules.isDate],
    MRZ: currentRules.isMRZContol
      ? [generalRules.required, dowodRules.mrzRules.controlCheck]
      : [generalRules.required],
  };
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
