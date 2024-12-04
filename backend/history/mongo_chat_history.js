const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// >>> install packages
// npm install axios express mongodb body-parser cors --save
// >>> start the service
// node server.js
// >>> add
// curl -X POST http://localhost:27018/add -H "Content-Type: application/json" -d '{"collectionName": "YZK01", "data":{"name": "Alice", "age": 25}}'

const app = express();
const port = 27018;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());
// MongoDB connection settings

const credentials = JSON.parse(fs.readFileSync('./etc/credentials.json'));
const uri = `mongodb://${credentials.username}:${credentials.password}@mongo:27017`;
const client = new MongoClient(uri);
const dbName = "testdb";
let db;

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log(`Connected to database: ${dbName}`);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

// Route to add data to a collection
app.post('/add', async (req, res) => {
    try {
        const { collectionName, data } = req.body;

        if (!collectionName || !data) {
            return res.status(400).json({ error: "Collection name and data are required." });
        }

        const collection = db.collection(collectionName);
        const result = await collection.insertOne(data);

        res.status(200).json({ message: "Data added successfully!", result });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Failed to add data." });
    }
});

// Route to get data from a collection
app.get('/messages', async (req, res) => {
    try {
        const { collectionName, query, limit } = req.query;

        if (!collectionName) {
            return res.status(400).json({ error: "Collection name is required." });
        }

        const collection = db.collection(collectionName);
        if (limit == null) {
            const results = await collection.find(JSON.parse(query)).toArray();
            res.status(200).json({ message: "Data retrieved successfully!", data: results });

        } else {
            const results = await collection.find(JSON.parse(query)).limit(Number(limit)).toArray();
            res.status(200).json({ message: "Data retrieved successfully!", data: results });

        }

    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).json({ error: "Failed to retrieve data." });
    }
});

// Route to drop a collection
app.delete('/drop', async (req, res) => {
    try {
        const { collectionName } = req.body;

        if (!collectionName) {
            return res.status(400).json({ error: "Collection name is required." });
        }

        await db.collection(collectionName).drop();
        res.status(200).json({ message: `Collection '${collectionName}' dropped successfully!` });
    } catch (error) {
        console.error("Error dropping collection:", error);

        if (error.codeName === 'NamespaceNotFound') {
            res.status(404).json({ error: "Collection does not exist." });
        } else {
            res.status(500).json({ error: "Failed to drop collection." });
        }
    }
});


app.delete("/deleteOne", async (request, response) => {
    try {
        const {collectionName, query} = request.body;

        if (!collectionName) {
            return response.status(400).json({ error: "Collection name is required." });
        }

        const collection = db.collection(collectionName);

        // Filter for the document to delete
        const filter = query; // Replace with your criteria

        // Delete the document
        const result = await collection.deleteOne(filter);

        if (result.deletedCount === 1) {
            response.status(200).json({ message: "Successfully deleted one document." } );
        } else {
            response.status(200).json({ message: "No document matched the query. Deleted 0 documents." } );
        }
    } catch (error) {
        response.status(500).json({ error: `Error deleting document: ${error}` });
    } 
});



// Start the server and connect to MongoDB
app.listen(port, "0.0.0.0", async () => {
    console.log(`Server running at http://localhost:${port}`);
    await connectToDatabase();
});
