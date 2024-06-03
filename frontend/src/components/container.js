import React from 'react';
import './components.css';


function MessageBubble({role, timestamp, message}) {

  return (
    <div className="msg-bubble">
      <div className="msg-info">
        <div className="msg-info-name">{role}</div>
        <div className="msg-info-time">{timestamp}</div>
      </div>
      <div className="msg-text">
        {message}
      </div>
    </div>
  );
}

function LeftMessage({role, timestamp, message}) {
  return (
    <div className="msg left-msg">
      <MessageBubble role={role} timestamp={timestamp} message={message}/>
    </div>
  );
}

function RightMessage({role, timestamp, message}) {
  return (
    <div className="msg right-msg">
      <MessageBubble role={role} timestamp={timestamp} message={message}/>
    </div>
  );
}

function Container() {
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

      <main className="msger-chat">
        <LeftMessage role={"BOT"} timestamp={"2024-06-03"} message={"How are you?"}/>
        <RightMessage role={"USER"} timestamp={"2024-06-03 12:00:12"} message={"I am fine."}/>
      </main>

      <form className="msger-inputarea">
        <input type={"text"} className={"msger-input"} placeholder={"Enter your message..."}/>
        <button type="submit" className="msger-send-btn">Send</button>
      </form>
    </section>
  );
}

export default Container;