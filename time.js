const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

console.time("MongoDB Connection Time");

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
    } finally {
        await client.close();
        console.timeEnd("MongoDB Connection Time");
    }
}

run().catch(console.dir);