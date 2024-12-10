
import React, { useEffect } from "react";
import { useState } from "react";


import InputArea from "./InputArea";
import axios from "axios";
import MessageContainer from "./MessageContainer";


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function getMessages(setHistory, collectionName, query, limit) {
  try {

      const params = {
          collectionName: collectionName,
          query: JSON.stringify(query),
          limit: limit
      };
      console.log("Get params:", params);

      const response = await axios.get('/messages', {
          params
      });

      const msg = response.data.data;
      setHistory(msg);
      
      console.log('Request URL:', response.config.url);

      console.log("Get Response:", response.data.data);
  } catch (error) {
      console.error("Get Error:", error.response ? error.response.data : error.message);
  }
}


export async function findData(setSomething, collectionName, query, limit) {
  try {
     
      const params = {
          collectionName: collectionName,
          query: JSON.stringify(query),
          limit: limit
      };
      console.log("Get params:", params);

      const response = await axios.get('http://localhost:27018/find', {
          params
      });
      console.log('Request URL:', response.config.url);

      console.log("Get Response:", response.data);
      console.log(`response.data.message (defined by yzk): ${response.data.message}`)
      // console.log(`response.data.message (defined by yzk): ${JSON.parse(response.data.data).toISOString}`)
      console.log(`response.data.message (defined by yzk): ${response.data.data}`)

      setSomething(response.data.data);
  } catch (error) {
      console.error("Get Error:", error.response ? error.response.data : error.message);
  }
}


function ChatUI() {

  const [conversationList, setConversationList] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState(1)
  const [history, setHistory] = useState([])

  // useEffect(() => {
  //   const convList = findData(setConversationList, "ConversationList", {}, null)
  // }, []);

  useEffect(() => {

    const convList = findData(setConversationList, "ConversationList", {}, null)
    const msg = getMessages(setHistory, "YZK01", { conversation_id: "1" }, null);
   

    // fetchMessages();
  }, []);



  // Function to add a new message to the message history
  const addHistory = (newMessage) => {
    setHistory((prevMessages) => [...prevMessages, newMessage]);
  };


  // Add a new conversation
  const addConversation = () => {
    const newId = conversationList.length ? conversationList[conversationList.length - 1].id + 1 : 1;
    const now = new Date();
    setConversationList([
      ...conversationList,
      { id: newId, title: `Conversation ${newId}`, messages: [], createTime: now },
    ]);
    setSelectedConversationId(newId);
  };

  // Delete a conversation
  const deleteConversation = (id) => {
    const updatedConversationList = conversationList.filter((conv) => conv.id !== id);
    setConversationList(updatedConversationList);
    if (id === selectedConversationId && updatedConversationList.length) {
      setSelectedConversationId(updatedConversationList[0].id);
    } else if (!updatedConversationList.length) {
      setSelectedConversationId(null);
    }
  };

  // // Get the selected conversation
  // const selectedConversation = conversationList.find(
  //   (conv) => conv.id === selectedConversationId
  // );

  return (
    
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left sidebar */}
      <div style={{ width: "25%", background: "#f0f0f0", padding: "10px" }}>
        <button onClick={() => addConversation()} style={{ marginBottom: "10px" }}>
          Add Conversation
        </button>
        {conversationList.map((conv) => (
          <div
            key={conv.id}
            style={{
              padding: "10px",
              margin: "5px 0",
              background: selectedConversationId === conv.id ? "#ccc" : "#fff",
              cursor: "pointer",
            }}
            onClick={() => setSelectedConversationId(conv.id)}
          >
            {conv.title}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
              style={{ float: "right" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Right side for message view */}
      <div style={{ flex: 1, padding: "10px", background: "#fff" }}>
        <MessageContainer messages={history}></MessageContainer>

        {/* <form className="msger-inputarea"> */}
        
        <InputArea addHistory={addHistory}/>
      </div>
      {/* </form> */}
    </div>
  );
}

export default ChatUI;
