import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod = undefined;

const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const mongooseOpts: any = {
    useNewUrlParser: true
  }

  mongoose.connect(uri, mongooseOpts)
}

const close = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
}

const clear = async () => {
  if (mongod) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
  }
}

export = {
  connect,
  close,
  clear
}

