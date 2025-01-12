import { useState } from "react";
import axios from "axios";

import "./InputArea.css";

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you're trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :(",
];

// Function to randomly select a bot response
function botResponse() {
  const randomIndex = Math.floor(Math.random() * BOT_MSGS.length);
  const msgText = BOT_MSGS[randomIndex];
  return msgText;
}

// const axios = require('axios'); // Only needed in Node.js; not required in a browser

// Define the OpenAI API URL and key
// const OPENAI_API_URL = "https://vllm:8000/v1/chat/completions";
// const OPENAI_API_URL = "/llm/v1/chat/completions";
// const FASTAPI_URL = "http://localhost:23456/text/generate";
const FASTAPI_URL = "http://10.39.72.43:23456/text/generate";
const OPENAI_API_URL = "/v1/chat/completions";

const API_KEY = "your-openai-api-key";

// Function to call OpenAI API using Axios
async function callOpenAI(addHistory, conversationId, msg) {
    try {
      const response = await axios.post(
          OPENAI_API_URL,
          {
              // model: "/models/Llama-3.2-3B-Instruct", // Specify the model
              model: "/models/Llama-3.2-1B-Instruct", // Specify the model

              messages: [
                  { role: "system", content: "You are a helpful assistant." },
                  { role: "user", content: msg }
              ],
              max_tokens: 512, // Limit the response length
              temperature: 0.7, // Adjust creativity
          },
          {
              headers: {
                  "Authorization": `Bearer ${API_KEY}`,
                  "Content-Type": "application/json"
              }
          }
      );

      const botMsg = response.data.choices[0].message.content;

      // Handle the response
      console.log("Response from OpenAI:", response.data.choices[0].message.content);
       
      const aiMessage = {
        conversationId: conversationId,
        message: botMsg,
        role: "assistant",
        idx: Date.now() + 1,
        side: "left",
      };

      addMessage(addHistory, aiMessage);

    } catch (error) {
      console.error("Error calling OpenAI API:", error.response?.data || error.message);
    }
}

// Call the function
// callOpenAI();

async function callFastAPI(addHistory, conversationId, msg) {

  // Example JavaScript code to send a POST request to a Python API
  // const data = {
  //   name: "John Doe",
  //   age: 30
  // };
  
  const data = {
    history: "empty",
    user_id: "yzk",
    conversation_id: conversationId.toString(),
    user_query: msg,
    message_id: 0,
    temperature: 0.2,
    max_new_tokens: 1024
  };

  
  fetch(FASTAPI_URL, { // Replace with your Python API URL
    method: "POST",
    headers: {
        "Content-Type": "application/json", // Ensure the server knows the data format
    },
    body: JSON.stringify(data), // Convert the object to a JSON string
  })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // const botMsg = response.data.choices[0].message.content;
        
  
        return response.json(); // Parse JSON response
        
  
    })
    .then(data => {
          const botMsg = JSON.stringify(data);
          console.log("Success:", botMsg); // Handle the API response

          const aiMessage = {
              conversationId: conversationId,
              message: botMsg,
              role: "assistant",
              idx: Date.now() + 1,
              side: "left",
          };
        addMessage(addHistory, aiMessage);
    })
    .catch(error => {

        console.error("Error:", error); // Handle errors
    });
};


async function addMessage(addHistory, message) {
  const payload = {
    collectionName: "ChatMessage",
    data: {
      conversationId: message.conversationId,
      messageId: message.idx,
      user: "yzk",
      role: message.role,
      message: message.message,
      side: message.side,
    },
  };
  try {
    const response = await axios.post("/add", payload);
    // const response = await axios.post("/mongodb/add", payload);

    addHistory(message);
    console.log("Add Response:", response.data);
  } catch (error) {
    console.error(
      "Add Error:",
      error.response ? error.response.data : error.message
    );
  }
}




function InputArea({ addHistory, conversationId }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat history
    const userMessage = {
      conversationId: conversationId,
      message: input,
      role: "user",
      idx: Date.now(),
      side: "right",
    };
    addMessage(addHistory, userMessage);
    // addHistory(userMessage);

    // Generate and add bot response

    // callOpenAI(addHistory, conversationId, input);
    callFastAPI(addHistory, conversationId, input);

    // const botMsg = botResponse();

    // const aiMessage = {
    //   conversationId: conversationId,
    //   message: botMsg,
    //   role: "assistant",
    //   idx: Date.now() + 1,
    //   side: "left",
    // };



    // addMessage(addHistory, aiMessage);

    // Clear input field
    setInput("");
  };

  return (
    <form className="msger-inputarea" onSubmit={handleSubmit}>
      <input
        type="text"
        className="msger-input"
        placeholder="Enter your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" disabled={conversationId === -1 ? true : false} className="msger-send-btn">
        Send
      </button>
    </form>
  );
}

export default InputArea;
