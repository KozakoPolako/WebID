import { rejects } from "assert";
import { ObjectID } from "bson";
import { Response } from "express";
import fs from "fs";
import {
  Collection,
  Db,
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSBucketWriteStream,
  InsertOneResult,
  MongoClient,
  Timestamp,
} from "mongodb";
import { resolve } from "path/posix";
import { User } from "../auth/User";
import { Dowod } from "../rec/dowodOsoistyPL";
import { Paszport } from "../rec/paszportPL";

const CONNECTION_STRING = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@webid-db`;

enum Documents {
  DOWOD,
  PASZPORT,
}

interface documentData {
  documentData: Dowod | Paszport;
  creationDate: Date;
}

type MongoUser = {
  keykloakID: string;
  dowods: ObjectID[];
  paszports: ObjectID[];
};

export type DowodPLDocument = {
  _id?: ObjectID;
  faceID: ObjectID;
  frontID: ObjectID;
  backID: ObjectID;
  saved: boolean;
  dataHistory: documentData[];
};
export type PaszportPLDocument = {
  _id?: ObjectID;
  faceID: ObjectID;
  photoID: ObjectID;
  saved: boolean;
  dataHistory: documentData[];
};
interface ValidateSettings {
  type: Documents;
  lastChange: Date;
  value: ValidateRules;
}
export interface ValidateRules {
  isNotExpired: boolean;
  isIssueDateCorrect: boolean;
  isPeselControl: boolean;
  isIDControl: boolean;
  isMRZContol: boolean;
  isAdultsOnly: boolean;
  isData_MRZValid: boolean;
}

class Mongo {
  client: MongoClient;
  database: Db | undefined;
  dowodsCol: Collection<DowodPLDocument> | undefined;
  passportsCol: Collection<PaszportPLDocument> | undefined;
  settingsCol: Collection<ValidateSettings> | undefined;
  usersCol: Collection<MongoUser> | undefined;

  photosBucket: GridFSBucket | undefined;

  constructor() {
    this.client = new MongoClient(CONNECTION_STRING);
    // this._connectionInit();
  }
  async _connectionInit() {
    try {
      await this.client.connect();
      console.log("Successfully connected to MongoDB.");
    } catch (error) {
      console.log("MongoDB Error: ", error);
    } finally {
      await this.client.close();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  //  Dowod
  ////////////////////////////////////////////////////////////////////////////////////////
  async insertDowod(
    ownerID: string,
    doc: Dowod,
    frontName: string,
    backName: string
  ): Promise<InsertOneResult<DowodPLDocument> | null> {
    try {
      if (!ownerID) {
        return null;
      }
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.dowodsCol = this.database.collection("dowody");
      this.usersCol = this.database.collection("uzytkownicy");
      this.photosBucket = new GridFSBucket(this.database, {
        bucketName: "DocumentPhoto",
      });

      const face = await this._uploadFile(
        `./temporary/${frontName}/face.jpg`,
        `${frontName}face.jpg`,
        this.photosBucket
      );
      const front = await this._uploadFile(
        `./temporary/${frontName}/document.jpg`,
        `${frontName}document.jpg`,
        this.photosBucket
      );
      const back = await this._uploadFile(
        `./temporary/${backName}/document.jpg`,
        `${backName}document.jpg`,
        this.photosBucket
      );

      console.log(
        `face id : ${face.id}  front id : ${front.id} back id : ${back.id}`
      );

      const dowod: DowodPLDocument = {
        faceID: face.id,
        frontID: front.id,
        backID: back.id,
        saved: false,
        dataHistory: [
          {
            creationDate: new Date(),
            documentData: doc,
          },
        ],
      };

      const results = await this.dowodsCol.insertOne(dowod);

      const filter = {
        keykloakID: ownerID,
      };
      const update = {
        $addToSet: {
          dowods: results.insertedId,
        },
      };
      const options = {
        upsert: true,
      };
      await this.usersCol.updateOne(filter, update, options);

      return results;
    } catch (error) {
      console.log(`Insert Error: ${error}`);
      return null;
    } finally {
      await this.client.close();
    }
  }
  async updateDocument(doc: Dowod, id: string): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.dowodsCol = this.database.collection("dowody");

      const filter = {
        _id: new ObjectID(id),
      };
      const update = {
        $addToSet: {
          dataHistory: {
            creationDate: new Date(),
            documentData: doc,
          },
        },
        $set: { saved: true },
      };
      const result = await this.dowodsCol.updateOne(filter, update);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error("Nie udało się zapisać dowodu");
    } finally {
      await this.client.close();
    }
  }
  async _uploadFile(
    path: string,
    filename: string,
    bucket: GridFSBucket
  ): Promise<GridFSBucketWriteStream> {
    return new Promise((resolve, reject) => {
      let file: GridFSBucketWriteStream;
      const stream = fs.createReadStream(path);
      stream.on("open", () => {
        file = stream.pipe(bucket.openUploadStream(filename));
        file.on("finish", () => {
          resolve(file);
        });
        file.on("error", (error) => {
          reject(error);
        });
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
  }
  async getDowod(id: string): Promise<DowodPLDocument | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.dowodsCol = this.database.collection("dowody");

      const doc = await this.dowodsCol.findOne<DowodPLDocument>({
        _id: new ObjectID(id),
      });
      console.log(doc);

      return doc ? doc : undefined;
    } catch (error) {
      console.log(`Find Error: ${error}`);
    } finally {
      await this.client.close();
    }
  }
  async deleteDowod(id: string): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.dowodsCol = this.database.collection("dowody");

      const results = await this.dowodsCol.deleteOne({
        _id: new ObjectID(id),
      });
      console.log(results);
      if (results.deletedCount != 1) {
        throw new Error("Nie udało się usunąć dokumentu");
      }
    } catch (error) {
      console.log(`Delete Error: ${error}`);
    } finally {
      await this.client.close();
    }
  }
  async getDowods(user: User): Promise<Array<DowodPLDocument> | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.dowodsCol = this.database.collection("dowody");
      this.usersCol = this.database.collection("uzytkownicy");
      if (user.isAdmin) {
        const documents = await this.dowodsCol.find({ saved: true }).toArray();
        return documents;
      } else {
        const userfilter = {
          keykloakID: user.ID,
        };
        const userInfo = await this.usersCol.findOne(userfilter);
        if (!userInfo) return [];

        const filter = {
          _id: {
            $in: userInfo.dowods,
          },
          saved: true,
        };
        const documents = await this.dowodsCol.find(filter).toArray();
        return documents;
      }

      // const options = {
      //   projection: {
      //     _id: 1,
      //   },
      // }
    } catch (error) {
    } finally {
      await this.client.close();
    }
  }
  async sendDowodPhotoByID(id: ObjectID, res: Response): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.dowodsCol = this.database.collection("dowody");
      this.photosBucket = new GridFSBucket(this.database, {
        bucketName: "DocumentPhoto",
      });

      const downloadStrem = this.photosBucket.openDownloadStream(id);
      await this._downloadFile(downloadStrem, res);
    } catch (error) {
    } finally {
      await this.client.close();
    }
  }
  async _downloadFile(
    stream: GridFSBucketReadStream,
    res: Response
  ): Promise<void> {
    {
      return new Promise((resolve, reject) => {
        stream.on("data", (data) => {
          res.status(200).write(data);
        });

        stream.on("error", (error) => {
          res.status(404).json({ message: "Nie można pobrać obrazka" });
          reject(error);
        });

        stream.on("end", () => {
          res.end();
          resolve();
        });
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  //  Paszport
  ////////////////////////////////////////////////////////////////////////////////////////

  async insertPassport(ownerID: string, doc: Paszport, photoName: string) {
    try {
      if (!ownerID) {
        return null;
      }
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.passportsCol = this.database.collection("paszporty");
      this.usersCol = this.database.collection("uzytkownicy");
      this.photosBucket = new GridFSBucket(this.database, {
        bucketName: "DocumentPhoto",
      });
      const face = await this._uploadFile(
        `./temporary/${photoName}/face.jpg`,
        `${photoName}face.jpg`,
        this.photosBucket
      );
      const photo = await this._uploadFile(
        `./temporary/${photoName}/document.jpg`,
        `${photoName}document.jpg`,
        this.photosBucket
      );
      const passport: PaszportPLDocument = {
        faceID: face.id,
        photoID: photo.id,
        saved: false,
        dataHistory: [
          {
            creationDate: new Date(),
            documentData: doc,
          },
        ],
      };
      const results = await this.passportsCol.insertOne(passport);
      const filter = {
        keykloakID: ownerID,
      };
      const update = {
        $addToSet: {
          paszports: results.insertedId,
        },
      };
      const options = {
        upsert: true,
      };
      await this.usersCol.updateOne(filter, update, options);

      return results;
    } catch (error) {
      console.log(`Insert Error: ${error}`);
    } finally {
      await this.client.close();
    }
  }

  async getPassport(id: string): Promise<PaszportPLDocument | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.passportsCol = this.database.collection("paszporty");
      const doc = await this.passportsCol.findOne<PaszportPLDocument>({
        _id: new ObjectID(id),
      });
      console.log(doc);

      return doc ? doc : undefined;
    } catch (error) {
      console.log(`Find Error: ${error}`);
    } finally {
      await this.client.close();
    }
  }
  async getPassports(
    user: User
  ): Promise<Array<PaszportPLDocument> | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.passportsCol = this.database.collection("paszporty");
      this.usersCol = this.database.collection("uzytkownicy");
      if (user.isAdmin) {
        const documents = await this.passportsCol
          .find({ saved: true })
          .toArray();
        return documents;
      } else {
        const userfilter = {
          keykloakID: user.ID,
        };
        const userInfo = await this.usersCol.findOne(userfilter);
        if (!userInfo) return [];
        const filter = {
          _id: {
            $in: userInfo.paszports,
          },
          saved: true,
        };
        const documents = await this.passportsCol.find(filter).toArray();
        return documents;
      }

      // const options = {
      //   projection: {
      //     _id: 1,
      //   },
      // }
    } catch (error) {
      console.log(`MongoERROR: ${error}`);
      return [];
    } finally {
      await this.client.close();
    }
  }
  async deletePassport(id: string): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.passportsCol = this.database.collection("paszporty");

      const results = await this.passportsCol.deleteOne({
        _id: new ObjectID(id),
      });
      console.log(results);
      if (results.deletedCount != 1) {
        throw new Error("Nie udało się usunąć dokumentu");
      }
    } catch (error) {
      console.log(`Delete Error: ${error}`);
    } finally {
      await this.client.close();
    }
  }
  async updatePassport(doc: Paszport, id: string): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.passportsCol = this.database.collection("paszporty");
      const filter = {
        _id: new ObjectID(id),
      };
      const update = {
        $addToSet: {
          dataHistory: {
            creationDate: new Date(),
            documentData: doc,
          },
        },
        $set: { saved: true },
      };
      const result = await this.passportsCol.updateOne(filter, update);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error("Nie udało się zapisać dowodu");
    } finally {
      await this.client.close();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  //  Autoryzacja
  ////////////////////////////////////////////////////////////////////////////////////////

  async isDowodOwner(userID: string, id: string): Promise<boolean> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.usersCol = this.database.collection("uzytkownicy");
      const filter = {
        keykloakID: userID,
        dowods: new ObjectID(id),
      };
      const results = await this.usersCol.findOne(filter);
      //console.log("rezultaty:::\n",results)
      return !(results == null);
    } catch (error) {
      return false;
    } finally {
      await this.client.close();
      //return false;
    }
  }
  async isPassportOwner(userID: string, id: string): Promise<boolean> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.usersCol = this.database.collection("uzytkownicy");
      const filter = {
        keykloakID: userID,
        paszports: new ObjectID(id),
      };
      const results = await this.usersCol.findOne(filter);
      //console.log("rezultaty:::\n",results)
      return !(results == null);
    } catch (error) {
      return false;
    } finally {
      await this.client.close();
      //return false;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  //  Ustawnienia
  ////////////////////////////////////////////////////////////////////////////////////////
  async getDowodValidateRules(): Promise<ValidateRules | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.settingsCol = this.database.collection("ustawnienia");

      const filter = {
        type: Documents.DOWOD,
      };

      const rules = await this.settingsCol.findOne(filter);

      if (!rules) {
        const setRules: ValidateRules = {
          isNotExpired: true,
          isIssueDateCorrect: true,
          isPeselControl: true,
          isIDControl: true,
          isMRZContol: true,
          isAdultsOnly: true,
          isData_MRZValid: true,
        };
        return setRules;
      } else {
        return rules.value;
      }
    } catch (error) {
      console.log(`MongoError: ${error}`);
    } finally {
      await this.client.close();
    }
    return undefined;
  }
  async getPaszportValidateRules(): Promise<ValidateRules | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.settingsCol = this.database.collection("ustawnienia");

      const filter = {
        type: Documents.PASZPORT,
      };

      const rules = await this.settingsCol.findOne(filter);

      if (!rules) {
        const setRules: ValidateRules = {
          isNotExpired: true,
          isIssueDateCorrect: true,
          isPeselControl: true,
          isIDControl: true,
          isMRZContol: true,
          isAdultsOnly: true,
          isData_MRZValid: true,
        };
        return setRules;
      } else {
        return rules.value;
      }
    } catch (error) {
      console.log(`MongoError: ${error}`);
    } finally {
      await this.client.close();
    }
    return undefined;
  }

  async setPaszportValidateRules(newRules: ValidateRules): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.settingsCol = this.database.collection("ustawnienia");

      const filter = {
        type: Documents.PASZPORT,
      };
      const update = {
        $set: {
          type: Documents.PASZPORT,
          lastChange: new Date(),
          value: newRules,
        },
      };
      const options = {
        upsert: true,
      };

      const result = await this.settingsCol.updateOne(filter, update, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
    } catch (error) {
    } finally {
      await this.client.close();
    }
  }

  async setDowodValidateRules(newRules: ValidateRules): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.settingsCol = this.database.collection("ustawnienia");

      const filter = {
        type: Documents.DOWOD,
      };
      const update = {
        $set: {
          type: Documents.DOWOD,
          lastChange: new Date(),
          value: newRules,
        },
      };
      const options = {
        upsert: true,
      };

      const result = await this.settingsCol.updateOne(filter, update, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
    } catch (error) {
    } finally {
      await this.client.close();
    }
  }
}

export default Mongo;

// function snippets

// try {
//   await this.client.connect();
//   this.database = this.client.db("WebID");
//   this.documentsCol = this.database.collection("paszporty");

// } catch (error) {

// } finally {
//   await this.client.close();
// }
