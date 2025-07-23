/**
 * This script initializes the server and handles requests.
 * It uses Express.js to define endpoints.
 * 
 * 
 * npm install axios body-parser cors express mongodb winston --save
 * node server.js
 * curl -X POST http://localhost:27018/add -H "Content-Type: application/json" -d '{"collectionName": "YZK01", "data":{"name": "Alice", "age": 25}}'
 */


import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import { createLogger, format as _format, transports as _transports } from 'winston';

import { MongoClient } from 'mongodb';

const logger = createLogger({
  level: 'info', // default level
  format: _format.combine(
    _format.timestamp(),
    _format.printf(({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new _transports.Console(),
    new _transports.File({ filename: 'logs/app.log' })
  ],
});

const port = 27018;  // express port
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection settings
const credentials = JSON.parse(readFileSync('./etc/credentials.json'));
const uri = `mongodb://${credentials.username}:${credentials.password}@mongo:27017`;  // mongo server
const client = new MongoClient(uri);
const dbName = "testdb";
let db;


// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db(dbName);
        logger.info(`Connected to database: ${dbName}`);
    } catch (error) {
        logger.error(`Failed to connect to MongoDB: ${error}`);
    }
}

// Route to add data to a collection
app.post('/add', async (req, res) => {
    try {
        const { collectionName, data } = req.body;

        if (!collectionName || !data) {
            logger.error("Collection name and data are required.");
            return res.status(400).json({ error: "[/add] Collection name and data are required." });
        }

        const collection = db.collection(collectionName);
        const result = await collection.insertOne(data);
        
        logger.info({ message: "[/add] Data added successfully!", result });
        res.status(200).json({ message: "[/add] Data added successfully!", result });
    } catch (error) {
        logger.error(`[/add] Error adding data: ${error}`);
        res.status(500).json({ error: "[/add] Failed to add data." });
    }
});



// Route to get data from a collection
app.get('/find', async (req, res) => {
    try {
        const { collectionName, query, limit } = req.query;

        if (!collectionName) {
            return res.status(400).json({ error: "[/find] Collection name is required." });
        }

        const collection = db.collection(collectionName);
        if (limit == null) {
            const results = await collection.find(JSON.parse(query)).toArray();
            res.status(200).json({ message: "[/find] Data retrieved successfully!", data: results });

        } else {
            const results = await collection.find(JSON.parse(query)).limit(Number(limit)).toArray();
            res.status(200).json({ message: "[/find] Data retrieved successfully!", data: results });

        }

    } catch (error) {
        console.error("[/find] Error getting data:", error);
        res.status(500).json({ error: "[/find] Failed to retrieve data." });
    }
});


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


app.delete("/delete", async (request, response) => {
    try {
        const {collectionName, query} = request.body;

        if (!collectionName) {
            return response.status(400).json({ error: "Collection name is required." });
        }

        const collection = db.collection(collectionName);

        // Filter for the document to delete
        const filter = query; // Replace with your criteria

        // Delete the document
        // const result = await collection.deleteOne(filter);
        const result = await collection.deleteMany(filter);

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
    logger.info(`Server running at http://localhost:${port}`);
    // logger.error('Something failed');
    console.log(`Server running at http://localhost:${port}`);
    await connectToDatabase();
});
