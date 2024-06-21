import React from 'react';
import { useEffect, useState } from 'react';
import './components.css';
import ChatMessage from './ChatMessage';
// import BotResponse from 'send';

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];

function botResponse() {
  const r = Math.random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  // const delay = msgText.split(" ").length * 100;

  // setTimeout(() => {
  //   appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  // }, delay);
  return msgText;
}


function Container({children}) {

  // const [query, setQuery] = useState('');
  // const [history, setHistory] = useState([]);

  return (
    <section className="msger">
      <header className="msger-header">
        <div className="msger-header-title">
          <i className="fas fa-comment-alt"></i> SimpleChat
        </div>
        <div className="msger-header-options">
          <span><i className="fas fa-cog"></i></span>
        </div>
      </header>

      <ul>
        {children.map(h => (
          <p>{h.role}{h.message}</p>
        ))}
      </ul>
      {/* <ChatMessage history={{history}} query={{query}}/> */}

     
      
    </section>
  );
}

export default Container;

// {/* <WrappedHistory>{history}</WrappedHistory> */}
// {
//   history.map(h => {
//     if (h.role === "user") {
//       return <RightMessage role={"USER"} timestamp={"2024-06-03 12:00:12"} message={query}/>;
//     } else {
//       return <LeftMessage role={"BOT"} timestamp={"2024-06-03"} message={"How are you?"}/>;
//     }}
//   )
// }
