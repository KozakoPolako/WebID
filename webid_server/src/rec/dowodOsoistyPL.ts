import { Multer } from "multer";
import { createWorker } from "tesseract.js";



enum Sex {
  Man,
  Woman,
}

class DowodOsobistyPL {
  id: string;
  surname: string;
  names: string[];
  parentsNames: string[];
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
    this.birthDate = birthDate;
    this.sex = sex;
    this.pesel = pesel;
    this.nationality = nationality;
    this.birthPlace = birthPlace;
    this.issuingAuthority = issuingAuthority;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
  }
  static async getDocumentFromPhoto(front: string): Promise<DowodOsobistyPL> {
    //console.log("front ", front, "back ", back);
    try {
      const worker = createWorker({
        logger: (m) => console.log(m),
      });
      await worker.load();
      await worker.loadLanguage("pol");
      await worker.initialize("pol");
      const {
        data: { text },
      } = await worker.recognize(front);
      await worker.terminate();
      console.log("Wynik: \n", text);
    } catch (e) {
      console.log(e);
    }

    return new DowodOsobistyPL(
      "01",
      "Dąbrowksi",
      ["Dariusz", "Józef"],
      ["Kazimierz", "Małgorzata"],
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
