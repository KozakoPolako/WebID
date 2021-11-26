import fs from "fs";
import { Collection, Db, GridFSBucket, GridFSBucketWriteStream, MongoClient } from "mongodb";

const CONNECTION_STRING = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@webid-db`;

class Mongo {
  client: MongoClient;
  database: Db | undefined;
  documentsCol: Collection | undefined;
  usersCol: Collection<Document> | undefined;
  photosBucket: GridFSBucket | undefined;

  constructor() {
    this.client = new MongoClient(CONNECTION_STRING);
    this._connectionInit();
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
  async insertDocument(doc: Object, frontName: string, backName: string) {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.documentsCol = this.database.collection("dokumenty");
      this.photosBucket = new GridFSBucket(this.database, {
        bucketName: "DowodPhotos",
      });


      // const fs  = await this.photosBucket.openUploadStream(`${frontName}face.jpg`)

      // const face = fs
      //   .createReadStream(`./temporary/${frontName}/face.jpg`)
      //   .pipe(this.photosBucket.openUploadStream(`${frontName}face.jpg`));
      // const front = fs
      //   .createReadStream(`./temporary/${frontName}/document.jpg`)
      //   .pipe(this.photosBucket.openUploadStream(`${frontName}document.jpg`));
      // const back = fs
      //   .createReadStream(`./temporary/${backName}/document.jpg`)
      //   .pipe(this.photosBucket.openUploadStream(`${backName}document.jpg`));

      const face = await this._uploadFile(`./temporary/${frontName}/face.jpg`,`${frontName}face.jpg`,this.photosBucket);
      const front = await this._uploadFile(`./temporary/${frontName}/document.jpg`,`${frontName}document.jpg`,this.photosBucket);
      const back = await this._uploadFile(`./temporary/${backName}/document.jpg`,`${backName}document.jpg`,this.photosBucket);

      console.log(
        `face id : ${face.id}  front id : ${front.id} back id : ${back.id}`
      );

      return await this.documentsCol.insertOne({
        faceID: face.id,
        frontID: front.id,
        backID: back.id,
        data: doc,
      });
    } catch (error) {
      console.log(`Insert Error: ${error}`);
      return null;
    } finally {
      await this.client.close();
    }
  }
  async _uploadFile(path: string, filename: string, bucket: GridFSBucket) : Promise<GridFSBucketWriteStream>  {
    return new Promise( (resolve, reject) => {
      let file: GridFSBucketWriteStream;
      const stream = fs.createReadStream(path)
      stream.on("open", () => {
        file = stream.pipe(bucket.openUploadStream(filename))
        file.on("finish",() => {
          resolve(file)
        })
        file.on("error", (error) => {
          reject(error)
        })
      })
      stream.on("error", (error) => {
        reject(error)
      })
    });
  }
}

export default new Mongo();
