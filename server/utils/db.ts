import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

const client = new MongoClient(uri);
let dbInstance: Db; // type from @types/mongodb

export const connectToDatabase = async () => {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('sourcix');
  }
  return dbInstance;
};
