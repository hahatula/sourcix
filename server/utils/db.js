import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://olgagolubevpro:9VoAVhwg2YSp685t@cluster0.eqaqe.mongodb.net/sourcix?retryWrites=true&w=majority&appName=Cluster0'; // Замени на свою строку подключения
const client = new MongoClient(uri);
let dbInstance;

export const connectToDatabase = async () => {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('sourcix');
  }
  return dbInstance;
};