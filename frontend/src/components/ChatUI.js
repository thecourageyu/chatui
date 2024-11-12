
import React, { useEffect } from "react";
import { useState } from "react";


import InputArea from "./InputArea";
import axios from "axios";
import MessageContainer from "./MessageContainer";




const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :(",
];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function botResponse({ q }) {
  const r = getRndInteger(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  // let msgText;
  let botRsp;
  console.log(msgText);

  // -H 'accept: application/json' \
  // -H 'Content-Type: application/json' \

  //   curl -X 'POST' \
  //   'http://10.39.72.43:23456/text/generate' \
  //   -H 'accept: application/json' \
  //   -H 'Content-Type: application/json' \
  //   -d '{
  //   "user_id": "YZK43",
  //   "conversation_id": "room1",
  //   "user_query": "新增高達站 時間改為2030年8月",
  //   "message_id": 0,
  //   "temperature": 0.2,
  //   "max_new_tokens": 2048
  // }'

  const data123 = {
    user_id: "YZK",
    conversation_id: "RoomReact",
    user_query: "你好嗎, Mecedes-Benz是一家公司嗎?",
    message_id: "0",
    temperature: "0.2",
    max_new_tokens: "2048",
  };

  // url: "http://localhost:8000/api/model-response/",
  // "http://10.39.72.43:23456/text/generate"
  // axios.get("http://localhost:8000/api/hello-world/", {
  // axios({
  //   method: "post",
  //   url: "http://10.39.72.43:23456/text/generate",
  //   headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  //   },
  //   json: data123
  // }).then(function (response) {
  //   // botRsp = response.data.user_intent;
  //   botRsp = response.data.message;
  //   console.log(response.data.message);
  //   console.log(botRsp)
  // }).catch(function (error) {
  //   console.log(error);
  // });

  axios
    .post("http://localhost:23456/text/generate/", {
      user_id: "YZK43",
      conversation_id: "room1",
      user_query: "list USA the first 50 companies",
      message_id: 0,
      temperature: 0.2,
      max_new_tokens: 1024,
    })
    .then((response) => {
      // console.log(response.data.content);
      console.log(response);
      msgText = response.data.text;
      // msgText = { role: "bot", message: response.data.content, timestamp: "2024-1234" }
      console.log(msgText);
      return msgText;
    })
    .catch((error) => {
      console.log(error);
    });

  // const response = axios.post(
  //   'http://10.39.72.43:23456/text/generate',
  //   // '{\n  "user_id": "YZK43",\n  "conversation_id": "room1",\n  "user_query": "新增高達站 時間改為2030年8月",\n  "message_id": 0,\n  "temperature": 0.2,\n  "max_new_tokens": 2048\n}',
  //   {
  //     user_id: 'YZK43',
  //     conversation_id: 'room1',
  //     user_query: '\u65B0\u589E\u9AD8\u9054\u7AD9 \u6642\u9593\u6539\u70BA2030\u5E748\u6708',
  //     message_id: 0,
  //     temperature: 0.2,
  //     max_new_tokens: 2048
  //   },
  //   {
  //     headers: {
  //       'accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }
  // );

  // console.log(response)
  // axios.post('http://localhost:8000/api/hello-world/')
  // .then(response => {
  //   setMessage(response.data.message);
  // })
  // .catch(error => {
  //   console.log(error);
  // });

  return msgText;
  // return botRsp;
}

async function ordersData() {
  axios
    .post("http://localhost:23456/text/generate/", {
      user_id: "YZK43",
      conversation_id: "room1",
      user_query: "list USA the first 50 companies",
      message_id: 0,
      temperature: 0.2,
      max_new_tokens: 1024,
    })
    .then((response) => {
      // console.log(response.data.content);
      console.log(response);
      const msgText = response.data.text;
      // msgText = { role: "bot", message: response.data.content, timestamp: "2024-1234" }
      console.log(msgText);
      return msgText;
    })
    .catch((error) => {
      console.log(error);
      return "never gonna give up";
    });
}


function ChatUI() {
  const r = Math.random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];

  const [query, setQuery] = useState("Hi, BMW!");
  const [history, setHistory] = useState([])

  // Function to add a new message to the message history
  const addHistory = (newMessage) => {
    setHistory((prevMessages) => [...prevMessages, newMessage]);
  };

  // const get_rsp = () => {
  //   let msgText;
  //   axios
  //     .post("http://localhost:23456/text/generate/", {
  //       user_id: "YZK43",
  //       conversation_id: "room1",
  //       user_query: "list USA the first 50 companies",
  //       message_id: 0,
  //       temperature: 0.2,
  //       max_new_tokens: 1024,
  //     })
  //     .then((response) => {
  //       // console.log(response.data.content);
  //       console.log(response);
  //       msgText = response.data.text;
  //       // msgText = { role: "bot", message: response.data.content, timestamp: "2024-1234" }
  //       console.log(msgText);
  //       return msgText;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return "GG la";
  //     });
  //   return msgText;
  // };

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
