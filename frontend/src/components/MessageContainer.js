import React from "react";
import "./MessageContainer.css"; // Assuming CSS is stored in the same folder

const MessageContainer = ({ messages }) => {
  return (
    <div className="message-container">
      {messages.map((message) => (
        <div
          key={message.idx}
          className={`message ${message.role === "user" ? "user-message" : "bot-message"}`}
        >
          <div className="message-text">{message.message}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
