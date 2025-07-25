
import React, { useEffect } from "react";
import { useState } from "react";

import axios from "axios";
import Dropdown from "./Dropdown";
import InputArea from "./InputArea";
import MessageContainer from "./MessageContainer";

import { FaMessage } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { useAuth } from "./AuthContext";


const MONGO_PROXY_PATH = "mongodb"  // proxy in setupProxy.js


async function addData(payload) {

  try {
    const response = await axios.post(`${MONGO_PROXY_PATH}/add`, payload);
    console.log("Add Response:", response.data);
  } catch (error) {
    console.error(
      "Add Error:",
      error.response ? error.response.data : error.message
    );
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

    const response = await axios.get(`${MONGO_PROXY_PATH}/find`, {
    // const response = await axios.get('/mongodb/find', {
      params
    });
    console.log('Request URL:', response.config.url);

    console.log("Get Response:", response.data);
    console.log(`response.data.message (defined by yzk): ${response.data.message}`)
    // console.log(`response.data.message (defined by yzk): ${JSON.parse(response.data.data).toISOString}`)
    console.log(`response.data.data (defined by yzk): ${response.data.data}`)

    setSomething(response.data.data);
  } catch (error) {
    console.error("Get Error:", error.response ? error.response.data : error.message);
  }
}


async function deleteData(collectionName, query) {
  // Delete the queried data
  const payload = { collectionName: collectionName, query: query }
  try {
    const response = await axios.delete(`${MONGO_PROXY_PATH}/delete`, {
      data: payload,
      // params: payload,
    });
    // logger.log(`Delete Response: ${response.data}`);
  } catch (error) {
    // logger.error(`Drop Error:, ${error.response ? error.response.data : error.message}`);
    console.error(`Drop Error:, ${error.response ? error.response.data : error.message}`);
  }
}

async function dropData(collectionName, query) {
  // Drop whole collection
  const payload = { collectionName: collectionName, query: query }
  try {
    const response = await axios.delete(`${MONGO_PROXY_PATH}/drop`, {
      data: payload,
      // params: payload,
    });
    // logger.info(`Drop Response:, ${response.data}`);
  } catch (error) {
    // logger.error(`Drop Error:, ${error.response ? error.response.data : error.message}`);
    console.error(`Drop Error:, ${error.response ? error.response.data : error.message}`);
  }
}


// function ChatUI({ user }) {
function ChatUI( { user } ) {
  //  collections in mongodb
  //    1. ConversationList
  //    2. ChatMessage
  //    3. Login

  // const { login_user, login, logout } = useAuth()
  // const user = login_user.name
  console.log(`[ChatUI] login user: ${user}`);


  const [selectedEndpoint, setSelectedEndpoint] = useState("chat");
  const [conversationList, setConversationList] = useState([]);  // save conversation list
  const [selectedConversationId, setSelectedConversationId] = useState(-1);  // set selected conversation
  const [history, setHistory] = useState([]);  // set the history to correspond to the selected conversation

  useEffect(() => {
    console.log(`current selectedConversationId: ${selectedConversationId}`)
    const convList = findData(setConversationList, "ConversationList", { user }, null)
    if (selectedConversationId !== -1) {
      // const msg = getMessages(setHistory, "ChatMessage", { conversationId: selectedConversationId }, null);
      const msg = findData(setHistory, "ChatMessage", { user: user, conversationId: selectedConversationId, endpoint: selectedEndpoint }, null);

    } else {
      setHistory([]);
    }
    // fetchMessages();
  }, []);


  // Function to add a new message to the message history
  const addHistory = (newMessage) => {
    setHistory((prevMessages) => [...prevMessages, newMessage]);
  };

  // Add a new conversation (conversationId)
  const addConversation = () => {
    const newId = conversationList.length ? conversationList[conversationList.length - 1].id + 1 : 1;
    const now = new Date();
    // const newConversation = { id: newId, title: `Conversation ${newId} (${now})`, createTime: now }
    const newConversation = { user: user, id: newId, title: `Conversation ${newId}`, createTime: now }

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

    const msg = findData(setHistory, "ChatMessage", { user: user, conversationId: selectedConversationId, endpoint: selectedEndpoint }, null);

  };


  // Delete a conversation
  const deleteConversation = (id) => {
    deleteData("ConversationList", { user: user, id: id })
    deleteData("ChatMessage", { user: user, conversationId: id })
    // dropData("ChatMessage", { conversationId: id })
    const updatedConversationList = conversationList.filter((conv) => conv.id !== id);
    setConversationList(updatedConversationList);
    if (id === selectedConversationId && updatedConversationList.length) {
      setSelectedConversationId(updatedConversationList[0].id);
      findData(setHistory, "ChatMessage", { user: user, conversationId: updatedConversationList[0].id, endpoint: selectedEndpoint }, null);

    } else if (!updatedConversationList.length) {
      setSelectedConversationId(null);
      setHistory([]);
    }
  };

  function handleSwitchConversation(id) {
    setSelectedConversationId(id);
    // const msg = getMessages(setHistory, "ChatMessage", { conversationId: selectedConversationId }, null);
    const msg = findData(setHistory, "ChatMessage", { user: user, conversationId: id, endpoint: selectedEndpoint }, null);
  };

  
  const handleDropDownChange = (event) => {
    setSelectedEndpoint(event.target.value);
    // selectedEndpoint此時即使重新設置，但還沒辦法調用到
    const msg = findData(setHistory, "ChatMessage", { user: user, conversationId: selectedConversationId, endpoint: event.target.value }, null);
  };

  return (
    // addConversation, deleteConversation, conversationList, setSelectedConversationId
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left sidebar */}
      <div style={{ width: "20%", background: "#f0f0f0", padding: "10px" }}>
        {/* Add Conversation */}
        <button onClick={() => addConversation()} title={"Add Conversation"} style={{ marginBottom: "1px" }}>
          <FaMessage />
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
            onClick={() => handleSwitchConversation(conv.id)}
          >
            {/* Dialogue */}
            {conv.title}
            {/* Delete dialogue*/}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
              style={{ float: "right" }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Right side for message view */}
      <div style={{ flex: 1, padding: "10px", background: "#fff" }}>
        <div>
          {/* <h3>chat message: {selectedConversationId}</h3> */}
          <div>ConversationId: {selectedConversationId}</div> 
          <div>Endpoint: {selectedEndpoint}</div>
          <Dropdown selectedOption={selectedEndpoint} handleDropDownChange={handleDropDownChange}/>
        </div>
        <MessageContainer messages={history}/>
        {/* <form className="msger-inputarea"> */}
        {/* <InputArea addHistory={addHistory} conversationId={selectedConversationId}/> */}
        <InputArea history={history} addHistory={addHistory} user={user} conversationId={selectedConversationId} endpoint={selectedEndpoint}/>

      </div>

    </div>
  );
}

export default ChatUI;
