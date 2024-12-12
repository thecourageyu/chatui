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

const axios = require('axios'); // Only needed in Node.js; not required in a browser

// Define the OpenAI API URL and key
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "your-openai-api-key";

// Function to call OpenAI API using Axios
async function callOpenAI() {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-3.5-turbo", // Specify the model
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
    const botMsg = botResponse();
    const aiMessage = {
      conversationId: conversationId,
      message: botMsg,
      role: "assistant",
      idx: Date.now() + 1,
      side: "left",
    };


    axios
    .post("http://localhost:23456/text/generate/", {
      user_id: "YZK43",
      conversation_id: "room1",
      user_query: input,
      message_id: 0,
      temperature: 0.2,
      max_new_tokens: 1024,
    })
    .then((response) => {
      console.log(response);
      const botMsg = response.data.text;
      const aiMessage = { message: botMsg, role: "bot", idx: Date.now() + 1, side: "left" };

      addHistory(aiMessage);

    })
    .catch((error) => {
      console.log(error);
      const botMsg = botResponse();
      const aiMessage = { message: botMsg, role: "bot", idx: Date.now() + 1, side: "left" };

      addHistory(aiMessage);
    });


    addMessage(addHistory, aiMessage);
    // addHistory(aiMessage);

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
