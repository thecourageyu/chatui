
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



function InputArea({addHistory}) {


  const handleSubmit = () => {


  };

  return (
    <form className="msger-inputarea">
      <input
        type="text"
        className="msger-input"
        onChange={(e) => {
          e.preventDefault();
          setQuery(e.target.value);
        }}
        placeholder={"Enter your message..."}
      />
      <button
        type="submit"
        className="msger-send-btn"
        onClick={(e) => {
          // e.preventDefault()
          let botRsp = botResponse({ query });
          // setMsg(get_rsp())
          setMsg(botRsp);

          addH
          addHistory([
            { role: "user", message: query, side: "right", idx1: idx },
            { role: "bot", message: msg, side: "left", idx1: idx },
          ]);
        }}
      >
        Send
      </button>
    </form>
  );
}

export default InputArea;
