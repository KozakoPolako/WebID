import { Collection, Db, MongoClient } from "mongodb";

const CONNECTION_STRING = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@webid-db`;

class Mongo {
  client: MongoClient;
  database: Db | undefined;
  documentsCol: Collection | undefined;
  usersCol: Collection<Document> | undefined;

  constructor() {
    this.client = new MongoClient(CONNECTION_STRING);
    this.connectInit();
  }
  async connectInit() {
    try {
      await this.client.connect();
      this.database = this.client.db("WebID");
      this.documentsCol = this.database.collection("dokumenty");
      console.log("Successfully connected to MongoDB.");
    } catch (error) {
      console.log("MongoDB Error: ", error);
    }
  }
  test() {
    console.log("test test");
  }
  insertDocument(doc:Object) {
    return this.documentsCol?.insertOne(doc)
  }
}

export default new Mongo()
