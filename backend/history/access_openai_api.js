// import axios from "axios";
const axios = require('axios'); // Only needed in Node.js; not required in a browser

// Define the OpenAI API URL and key
// const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const PORT = "8000"
const BASE_URL = `http://vllm:${PORT}`;
const OPENAI_API_URL = `${BASE_URL}/v1/chat/completions`;
const API_KEY = "your-openai-api-key";

async function getDeployedModel() {
  try {
    const response = await axios.get(`${BASE_URL}/v1/models`); // Replace with your vLLM API URL
    if (response.data && response.data.data) {
      const models = response.data.data;
      console.log('Available Models:', models);
      if (models.length > 0) {
        console.log('Deployed Model Name:', models[0].id); // Assuming the first model is the primary one
      } else {
        console.log('No models deployed.');
      }
    } else {
      console.log('Unexpected response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching models:', error.message);
  }
}

// Call the function
const MODLE_NAME = getDeployedModel();
console.log(`model name: ${MODLE_NAME}`)

// Function to call OpenAI API using Axios
async function callOpenAI() {
    // const model_name = "/models/Llama-3.2-3B-Instruct";
    const model_name = "/models/Llama-3.2-1B-Instruct";

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                // model: "gpt-3.5-turbo", // Specify the model
                model: model_name, // Specify the model
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Tell me a joke." }
                ],
                max_tokens: 100, // Limit the response length
                temperature: 0.7, // Adjust creativity
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Handle the response
        console.log("Response from OpenAI:", response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response?.data || error.message);
    }
}

// Call the function
callOpenAI();