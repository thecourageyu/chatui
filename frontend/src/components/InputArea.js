import { useState } from "react";

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];

function botResponse({query}) {
  const r = Math.random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  // const delay = msgText.split(" ").length * 100;

  // setTimeout(() => {
  //   appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  // }, delay);
  console.log("Its work?")
  return msgText;
}



function InputArea({addHistory}) {

  const [response, setResponse] = useState("How can I help you?");
  const [query, setQuery] = useState("Hello world!");

  const handleSubmit = (e) => {
    e.preventDefault();
    

    // addHistory(history => ([
    //   ...history,
    //   { role: "user", message: query, side: "right", idx: 1 },
    //   { role: "bot", message: response, side: "left", idx: 2 },
    // ]));

    // addHistory(
    //   { role: "bot", message: response, side: "left", idx: 2 }
    
    // );

    addHistory(
      query
    
    );


    setQuery("");
  };

  return (
    <form className="msger-inputarea" onSubmit={handleSubmit}>
      <input
        type="text"
        className="msger-input"
        placeholder={"Enter your message..."}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
          
      />
      <button
        type="submit"
        className="msger-send-btn"
        onClick={(e) => {
          // e.preventDefault()
          // let botRsp = botResponse({ query });
          // setMsg(get_rsp())
          setResponse(() => botResponse({ query }));
          addHistory(
            response
          
          );
        }}
      >
        Send
      </button>
    </form>
  );
}

export default InputArea;
