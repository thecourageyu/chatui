import { useState } from "react";
import axios from "axios";

import "./InputArea.css";

const MONGO_PROXY_PATH = "mongodb"
const MODEL_PATH = "/models/Llama-3.2-1B-EV-1";

// Define the OpenAI API URL and key
// const OPENAI_API_URL = "https://vllm:8000/v1/chat/completions";
const OPENAI_API_URL = "/v1/chat/completions";

const API_KEY = "your-openai-api-key";
const tools = [

    {
      type: "function",
      function: {
        name: 'find_contact_get_time_estimate',
        description: '尋找聯絡人位置後計算預估時間',
        parameters: {'type': 'object',
          properties: {'contacts': {'type': 'array','description': '聯絡人名稱'}},
          required: ['contacts']
        }
      }
    },
];


// Function to call OpenAI API using Axios
async function callOpenAI(addHistory, msg, user, conversationId, endpoint) {

    console.log("msg (input of callOpenAI): ", msg);

    try {
      const response = await axios.post(
          OPENAI_API_URL,
          {
              // model: "/models/Llama-3.2-3B-Instruct", // Specify the model
              // model: "/models/Llama-3.2-1B-EV-1", // Specify the model
              model: MODEL_PATH, // Specify the model

              // messages: [
              //     { role: "system", content: "You are a helpful assistant." },
              //     { role: "user", content: msg }
              // ],
              // messages: JSON.stringify(msg),
              messages: msg,
              max_tokens: 512, // Limit the response length
              temperature: 0.7, // Adjust creativity
              tools: tools,
              tool_choice: "auto"
          },
          {
              headers: {
                  "Authorization": `Bearer ${API_KEY}`,
                  "Content-Type": "application/json"
              }
          }
      );
    
      const content = response.data.choices[0].message.content
      const funcname = response.data.choices[0].message.tool_calls[0].function.name 
      const funcargs = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).contacts;
      const botMsg = `content: ${content}; funcname: ${funcname}; funcargs: ${funcargs}`
      // const botMsg = decoder.decode(buffer.arrayBuffer());

      // Handle the response
      console.log("Response from OpenAI:", response.data.choices[0].message.content);
              
      const aiMessage = {
        user: user,
        conversationId: conversationId,
        endpoint: endpoint,
        idx: Date.now() + 1,
        role: "assistant",
        message: botMsg,
        side: "left",
      };

      addMessage(addHistory, aiMessage);

    } catch (error) {
      console.log("Error calling OpenAI API:", error.response?.data || error.message);
    }
}

async function callFastAPI(addHistory, msg, user, conversationId, endpoint) {

  // axios.post(url, {user_query: "how are you?"}).then((resolve, reject) => {console.log(resolve.data.text)});
  // const url = "http://localhost:23456/text/generate";

  // The API "http://host.docker.internal:9991/chat" can be called from within the container using the terminal, 
  // but it cannot be accessed from the web service running inside the same container—it only results in a timeout error.

  // host.docker.internal is a special DNS name only usable from inside Docker containers.
  // It does not work from a browser, which is running outside Docker (i.e., your host OS).
  // When your browser hits http://host.docker.internal:9991, it cannot resolve the address or connect — hence timeout.

  // Fix: Use http://localhost:9991 in browser
  const url = `http://localhost:9991/${endpoint}`;  // access DGX API by local port forwarding from within a Docker container 
  let payload;

  if (endpoint === 'detector') {
    payload = {
      text: msg
    };

  } else {
    payload = {
      messages: msg,
      temperature: 0.7,
      max_tokens: 2048
    };
  }

  try {
    const response = await axios.post(
      url,
      payload,
      {
        headers: {
            // "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        }
      }
    );
    // console.log("Check response from fastapi: ", response);
    console.log(`[InputArea][callFastAPI] Response (fastapi): ${response}`);
    
    let botMsg;
    let tods;
    if (endpoint === 'detector') {
      botMsg = `label: ${response.data.label}`;

    } else {
      botMsg = response.data.response;
      tods = response.data.tods;
    };

    // const funcname = response.data.choices[0].message.tool_calls[0].function.name 
    // const funcargs = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).contacts;
    // const botMsg = `content: ${content}; funcname: ${funcname}; funcargs: ${funcargs}`


    // Handle the response
    // console.log("Response from OpenAI:", response.data);
       
    const aiMessage = {
      user: user,
      conversationId: conversationId,
      endpoint: endpoint,
      messageId: Date.now() + 1,
      role: "assistant",
      message: botMsg,
      tods: tods,
      side: "left",
    };

    addMessage(addHistory, aiMessage);
  } catch(error) {
    console.error(`[ERR][InputArea][callFastAPI] calling fast API: ${error.response?.data || error.message}`);
  }
}


async function addMessage(addHistory, msgObj) {
  // YZK (2025-07-25)
  // 存進 collection: ChatMessage, 包含 tods, summarizer, planner
  // 因需展示在螢幕上且刷新網頁後會重新抓資料庫, 故不能只存tods的資訊, 改成調用API之前只取tods部分進chat history
  const payload = {
    collectionName: "ChatMessage",
    data: msgObj,
  };
  
  try {
    const response = await axios.post(`${MONGO_PROXY_PATH}/add`, payload);
    
    console.log(`[InputArea][addMessage] Add Response: ${response.data}`);
  } catch (error) {
    console.error(
      `[ERR][InputArea][addMessage] Add Response: ${error.response ? error.response.data : error.message}`
    );
  }

  addHistory(msgObj);

  // try {
  //   let display_on_screen = "";
    
  //   if (msgObj.role === "assistant") {
  //     const O = JSON.parse(msgObj.message)
  //     for (const [k, v] of Object.entries(O)) {
  //       display_on_screen += `[${k}] ${v}\n`;
  //     }
  //     msgObj.message = display_on_screen;
  //   }
  //   addHistory(msgObj);
    
  //   console.log("[INFO][InputArea][displayOnScreen]");
  // } catch (error) {
  //   addHistory(msgObj);
  //   console.error(
  //     "[ERROR][InputArea][displayOnScreen]",
  //     error.response ? error.response.data : error.message
  //   );
  // }
}

function InputArea({ history, addHistory, user, conversationId, endpoint }) {
  const [input, setInput] = useState("");

  const collectionName = 'ChatMessage';
  const limit = 20;  // Tracking conversation turns


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat history
    const userMessage = {
      user: user,
      conversationId: conversationId,
      endpoint: endpoint,
      messageId: Date.now(),
      role: "user",
      message: input,
      side: "right",
    };

    addMessage(addHistory, userMessage);
  
    // let system_prompt = '';
    let chat_msg = [];
//     if (endpoint === 'chat') {
//       system_prompt = `"""
// """`;
//       chat_msg = [{role: "system", content: system_prompt}];
//     }


    for (let i = 0; i < history.length; i++) {
      if (history[i].role === 'assistant') {
        try {
          let content = history[i].message;
          if (history[i].hasOwnProperty('tods')) {
            if (history[i].tods.trim().length > 0) {
              content = history[i].tods;
            }
          }
          console.log(`[InputArea] content: ${content}; raw history: ${history[i].message}`)
          chat_msg.push({role: history[i].role, content: content});
        } catch (err) {
          const content = history[i].message;
          console.error(`[ERR][InputArea] content: ${content}; raw history: ${history[i].message}`)
          chat_msg.push({role: history[i].role, content: content});
        }
        
        
      } else {
        chat_msg.push({role: history[i].role, content: history[i].message});
      }
    }
    chat_msg.push({role: 'user', content: input});
    console.log(`[InputArea] history: ${chat_msg}`);

    if (endpoint === 'detector') {
      callFastAPI(addHistory, input, user, conversationId, endpoint);

    } else {
      callFastAPI(addHistory, chat_msg, user, conversationId, endpoint);

    }

    // Clear input field
    setInput("");
  };

  return (
    <form className="msger-inputarea" onSubmit={handleSubmit}>
      <input
        type="text"
        className="msger-input"
        placeholder="Enter your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" disabled={conversationId === -1 ? true : false} className="msger-send-btn">
        Send
      </button>
    </form>
  );
}

export default InputArea;
