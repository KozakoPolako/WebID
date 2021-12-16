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
  MongoClient,
  Timestamp,
} from "mongodb";
import { resolve } from "path/posix";
import { Dowod } from "../rec/dowodOsoistyPL";

const CONNECTION_STRING = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@webid-db`;

enum Documents {
  DOWOD,
  PASZPORT,
}

interface documentData {
  documentData: Dowod;
  creationDate: Date;
}

export interface DowodPLDocument {
  _id?: ObjectID;
  faceID: ObjectID;
  frontID: ObjectID;
  backID: ObjectID;
  saved: boolean;
  dataHistory: documentData[];
}
interface ValidateSettings {
  type: Documents;
  lastChange: Date;
  value: DowodPLValidateRules;
}
export interface DowodPLValidateRules {
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
  documentsCol: Collection<DowodPLDocument> | undefined;
  settingsCol: Collection<ValidateSettings> | undefined;

  usersCol: Collection<Document> | undefined;
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
  test() {
    console.log("test test");
  }
  async insertDocument(doc: Dowod, frontName: string, backName: string) {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.documentsCol = this.database.collection("dokumenty");
      this.photosBucket = new GridFSBucket(this.database, {
        bucketName: "DowodPhotos",
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
      return await this.documentsCol.insertOne(dowod);
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
      this.documentsCol = this.database.collection("dokumenty");

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
      const result = await this.documentsCol.updateOne(filter, update);
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
      this.documentsCol = this.database.collection("dokumenty");

      const doc = await this.documentsCol.findOne<DowodPLDocument>({
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
      this.documentsCol = this.database.collection("dokumenty");

      const results = await this.documentsCol.deleteOne({
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
  async getDowods(): Promise<Array<DowodPLDocument> | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.documentsCol = this.database.collection("dokumenty");

      const filter = {
        saved: true,
      };
      // const options = {
      //   projection: {
      //     _id: 1,
      //   },
      // }

      const documents = await this.documentsCol.find(filter).toArray();
      return documents;
    } catch (error) {
    } finally {
      await this.client.close();
    }
  }
  async sendDowodPhotoByID(id: ObjectID, res: Response): Promise<void> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.documentsCol = this.database.collection("dokumenty");
      this.photosBucket = new GridFSBucket(this.database, {
        bucketName: "DowodPhotos",
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
  //  Ustawnienia
  ////////////////////////////////////////////////////////////////////////////////////////
  async getDowodValidateRules(): Promise<DowodPLValidateRules | undefined> {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.settingsCol = this.database.collection("ustawnienia");

      const filter = {
        type: Documents.DOWOD,
      };

      const rules = await this.settingsCol.findOne(filter);

      return rules?.value;
    } catch (error) {
      console.log(`MongoError: ${error}`)
    } finally {
      await this.client.close();
    }
    return undefined;
  }
  async setDowodValidateRules(newRules: DowodPLValidateRules): Promise<void> {
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
        }
        const options = {
          upsert: true,
        }

        const result = await this.settingsCol.updateOne(filter,update,options)
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
//   this.documentsCol = this.database.collection("dokumenty");

// } catch (error) {

// } finally {
//   await this.client.close();
// }
