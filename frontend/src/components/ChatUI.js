
import React, { useEffect } from "react";
import { useState } from "react";


import InputArea from "./InputArea";
import axios from "axios";
import MessageContainer from "./MessageContainer";


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function addData(payload) {

  try {
    const response = await axios.post("/add", payload);
    console.log("Add Response:", response.data);
  } catch (error) {
    console.error(
      "Add Error:",
      error.response ? error.response.data : error.message
    );
  }
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

    const response = await axios.get('/find', {
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


async function deleteData(collectionName, query) {
  // const payload = { collectionName: "Conversation", query: { conversation_id: "test01" } }
  const payload = { collectionName: collectionName, query: query }
  try {
    const response = await axios.delete('/delete', {
      data: payload,
    });
    console.log("Drop Response:", response.data);
  } catch (error) {
    console.error("Drop Error:", error.response ? error.response.data : error.message);
  }
}


function ChatUI() {

  const [conversationList, setConversationList] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState(-1)
  const [history, setHistory] = useState([])

  // useEffect(() => {
  //   const convList = findData(setConversationList, "ConversationList", {}, null)
  // }, []);

  useEffect(() => {
    console.log(`current selectedConversationId: ${selectedConversationId}`)
    const convList = findData(setConversationList, "ConversationList", {}, null)
    if (selectedConversationId !== -1) {
      const msg = getMessages(setHistory, "ChatMessage", { conversationId: selectedConversationId }, null);
    } else {
      setHistory([]);
    }


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
    const newConversation = { id: newId, title: `Conversation ${newId} (${now})`, createTime: now }

    setConversationList([
      ...conversationList,
      newConversation,
    ]);
    setSelectedConversationId(newId);

    const payload = {
      collectionName: "ConversationList",
      data: newConversation,
    };
    addData(payload);

    const msg = getMessages(setHistory, "ChatMessage", { conversationId: selectedConversationId }, null);
  };

  // Delete a conversation
  const deleteConversation = (id) => {
    deleteData("ConversationList", { id: id })
    deleteData("ChatMessage", { conversationId: id})
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


  const convListArgs = {
    addConversation: addConversation,
    deleteConversation: deleteConversation,
    setSelectedConversationId: setSelectedConversationId,
    conversationList: conversationList
  }

  function handleSwitchConversation(id) {
    setSelectedConversationId(id);
    // const msg = getMessages(setHistory, "ChatMessage", { conversationId: selectedConversationId }, null);
    const msg = getMessages(setHistory, "ChatMessage", { conversationId: id }, null);
  };

  return (
    // addConversation, deleteConversation, conversationList, setSelectedConversationId
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
            // onClick={() => setSelectedConversationId(conv.id)}
            onClick={() => handleSwitchConversation(conv.id)}
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
        <h3>chat message: {selectedConversationId}</h3>
        <MessageContainer messages={history}></MessageContainer>

        {/* <form className="msger-inputarea"> */}

        <InputArea addHistory={addHistory} conversationId={selectedConversationId}/>
      </div>
      {/* </form> */}
    </div>
  );
}

export default ChatUI;
