const axios = require('axios');

// Add data
async function addData() {

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

// Get data
async function getData() {
    try {
        const params = {
            collectionName: "YZK01",
            query: JSON.stringify({ conversation_id: "1" }),
            limit: 10
        };
        const response = await axios.get('http://localhost:27018/get', {
            params
        });
        console.log("Get Response:", response.data);
    } catch (error) {
        console.error("Get Error:", error.response ? error.response.data : error.message);
    }
}

// Drop collection
async function dropCollection() {
    const payload = { collectionName: "YZK01" }
    try {
        const response = await axios.delete('http://localhost:27018/drop', {
            data: payload,

        });
        console.log("Drop Response:", response.data);
    } catch (error) {
        console.error("Drop Error:", error.response ? error.response.data : error.message);
    }
}

// Example usage
(async () => {
    await addData();
    await getData();
    await dropCollection();
})();
