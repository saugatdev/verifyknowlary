import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not set. Add it to your .env.local file.');
}

const DATABASE_NAME = process.env.MONGODB_DB || 'certify';
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'certificates';

let client;
let cachedDb;

const getClient = async () => {
  if (client) return client;
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
};

export const getCertificatesCollection = async () => {
  if (cachedDb) return cachedDb.collection(COLLECTION_NAME);
  const connectedClient = await getClient();
  cachedDb = connectedClient.db(DATABASE_NAME);
  return cachedDb.collection(COLLECTION_NAME);
};

export const closeClient = async () => {
  if (client) {
    await client.close();
    client = undefined;
    cachedDb = undefined;
  }
};
