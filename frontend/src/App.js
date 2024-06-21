import React, { useEffect } from 'react';
import { useState } from 'react';
import HelloWorld from './HelloWorld';
import { Container } from './components/Container';
import InputArea from './components/InputArea';


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
  console.log(msgText)
  let ttt = "FQ";
  // const delay = msgText.split(" ").length * 100;

  // setTimeout(() => {
  //   appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  // }, delay);
  // return msgText;
  return ttt;
}

function App() {
  const [query, setQuery] = useState("Hi, BMW!")
  const [history, setHistory] = useState([{ role: "bot", message: "Hello world!", side: "left" }])
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    let botRsp = botResponse();
    // console.log(query);
    // console.log(idx);
    console.log(history.length);
    console.log(botRsp);
  }, [history]);
  let i = 0;

  return (
    <>
      
      <HelloWorld />
   
      <ul>
        {history.map(h => (
          <p>{h.role}: {h.message}</p>
        ))}
      </ul>

      {/* <form className="msger-inputarea"> */}
      <input type="text" className="msger-input1" onChange={e => setQuery(e.target.value)} placeholder={"Enter your message..."}/> 
      <button type="submit" className="msger-send-btn1" onClick={() => {
        // let botRsp = botResponse();
        // setIdx(i++);
        setHistory([
          ...history,
          { role: "user", message: query, side: "right" },
          { role: "bot", message: botResponse(), side: "left" }
        ]);
      }}>Send</button>
        
      {/* </form> */}
      
    </>
  );
}

export default App;