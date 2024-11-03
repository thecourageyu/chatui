import './components.css';

function InputArea({ setQuery, history, setHistory }) {
  return (
    <form className="msger-inputarea">
      <input
        type={"text"}
        id={"input_box"}
        className={"msger-input"}
        
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"Enter your message..."}
      />
      <button
        type="submit"
        className="msger-send-btn"
        onClick={() => {
          setHistory([
            ...history,
            { role: "USER", message: 'QQQQQQQQQQQQQQQ', side: "right" },
          ]);
        }}
      >
        Send
      </button>
    </form>
  );
}

export default InputArea;
