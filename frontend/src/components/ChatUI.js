
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


function ChatUI() {

  const [history, setHistory] = useState([])

  useEffect(() => {

    // const getMessages = (collectionName, query12, limit) => {
    //   try {

    //       const params = {
    //           collectionName: collectionName,
    //           query: JSON.stringify(query12),
    //           limit: limit
    //       };

    //       const response = axios.get('/messages', {
    //           params
    //       });
    //       const msg = response.data.data;
    //       setHistory(msg);
    //       console.log("Get Response:", response.data);
    //   } catch (error) {
    //       console.error("Get Error:", error.response ? error.response.data : error.message);
    //   }
    // }


    const msg = getMessages(setHistory, "YZK01", { conversation_id: "1" }, null);
   

    // fetchMessages();
  }, []);

  // Function to add a new message to the message history
  const addHistory = (newMessage) => {
    setHistory((prevMessages) => [...prevMessages, newMessage]);
  };


  return (
    <div>
      {/* <ul key="hmap">
        {history.map((h) => (
          <p>
            {h.role}: {h.message}
          </p>
        ))}
      </ul> */}

      <MessageContainer messages={history}></MessageContainer>

      {/* <form className="msger-inputarea"> */}
      
      <InputArea addHistory={addHistory}/>

      {/* </form> */}
    </div>
  );
}

export default ChatUI;
