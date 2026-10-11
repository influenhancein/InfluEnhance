const { MongoClient } = require("mongodb");

let client;
let usersCollection;

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("MONGODB_URI and MONGODB_DB must be configured.");
  }

  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }

  client = new MongoClient(uri);
  await client.connect();
  usersCollection = client.db(databaseName).collection("users");
  await usersCollection.createIndex({ email: 1 }, { unique: true });
}

function getUsersCollection() {
  if (!usersCollection) {
    throw new Error("The database connection has not been initialized.");
  }

  return usersCollection;
}

module.exports = { connectDatabase, getUsersCollection };
