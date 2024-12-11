// const axios = require('axios');
import axios from "axios";
import { query } from "express";
import { Timestamp } from "mongodb";

// How to Enable ES Modules in Node.js
// 1. Add "type": "module" in package.json
// 2. Use the .mjs Extension
// 3. node --input-type=module main.js

// Add data
async function addMessage() {

    const payload = {
        collectionName: 'YZK01',
        data: {
            conversation_id: "1",
            message_id: 1,
            user_id: "yzk",
            role: "user",
            message: 'how are you',
            age: null
        }
    };
    try {
        const response = await axios.post('http://localhost:27018/add', payload);
        console.log("Add Response:", response.data);
    } catch (error) {
        console.error("Add Error:", error.response ? error.response.data : error.message);
    }
}

// Add data
async function addData(collectionName, data) {

    const payload = {
        collectionName: collectionName,
        data: data,
    };
    try {
        const response = await axios.post('http://localhost:27018/add', payload);
        console.log("Add Response:", response.data);
    } catch (error) {
        console.error("Add Error:", error.response ? error.response.data : error.message);
    }
}

// Get data
export async function findData(collectionName, query, limit) {
    try {
       
        const params = {
            collectionName: collectionName,
            query: JSON.stringify(query),
            limit: limit
        };
        console.log("Get params:", params);

        const response = await axios.get('http://localhost:27018/find', {
            params
        });
        console.log('Request URL:', response.config.url);

        console.log("Get Response:", response.data);
        console.log(`response.data.message (defined by yzk): ${response.data.message}`)
        // console.log(`response.data.message (defined by yzk): ${JSON.parse(response.data.data).toISOString}`)
        console.log(`response.data.message (defined by yzk): ${response.data.data}`)

    } catch (error) {
        console.error("Get Error:", error.response ? error.response.data : error.message);
    }
}


// Drop collection
async function dropCollection() {
    const payload = { collectionName: "ConversationList" }
    try {
        const response = await axios.delete('http://localhost:27018/drop', {
            data: payload,

        });
        console.log("Drop Response:", response.data);
    } catch (error) {
        console.error("Drop Error:", error.response ? error.response.data : error.message);
    }
}


async function deleteData(collectionName, query) {
    // const payload = { collectionName: "Conversation", query: { conversation_id: "test01" } }
    const payload = { collectionName: collectionName, query: query }
    try {
        const response = await axios.delete('http://localhost:27018/delete', {
            data: payload,

        });
        console.log("Drop Response:", response.data);
    } catch (error) {
        console.error("Drop Error:", error.response ? error.response.data : error.message);
    }
}


const now = new Date();

// Example usage
(async () => {
    // await addMessage();
    await addData("Conversation", { conversation_id: "conversation01", user_id: "yzk", timestamp: now.toISOString() });
    await addData("Message", { conversation_id: "conversation01", user_id: "yzk", message: "how are you?", timestamp: now.toISOString() });
    
    await findData("Conversation", { conversation_id: "conversation01" }, 10);
    await findData("Message", {}, 10);
    await dropCollection();
    await deleteData();
})();
