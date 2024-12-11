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
      <button type="submit" className="msger-send-btn">
        Send
      </button>
    </form>
  );
}

export default InputArea;
