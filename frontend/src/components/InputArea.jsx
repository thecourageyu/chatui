import { useState } from "react";
import axios from "axios";

import "./InputArea.css";

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you're trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :(",
];

const MODEL_PATH = "/models/Llama-3.2-1B-EV-1";

// Function to randomly select a bot response
function botResponse() {
  const randomIndex = Math.floor(Math.random() * BOT_MSGS.length);
  const msgText = BOT_MSGS[randomIndex];
  return msgText;
}

// const axios = require('axios'); // Only needed in Node.js; not required in a browser

// Define the OpenAI API URL and key
// const OPENAI_API_URL = "https://vllm:8000/v1/chat/completions";
// const OPENAI_API_URL = "/llm/v1/chat/completions";
const OPENAI_API_URL = "/v1/chat/completions";
const MONGO_PROXY_PATH = "mongodb"
const API_KEY = "your-openai-api-key";
const tools = [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get weather for a location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string"
            }
          },
          required: ["location"]
        }
      }
    },
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
    {
      type: "function",
      function: {
        name: 'send_message_estimate_time',
        description: '傳送訊息給聯絡人，包含預估抵達時間',
        parameters: {
          type: 'object',
          properties: {
            contacts: {
              type: 'array',
              description: '聯絡人名稱'
            }
          },
          required: ['contacts']
        }
      }
    },
    {
      type: "function",
      function: {
        name: 'google_map_set_destination',
        description: '使用 google map api 設定目的地',
        parameters: {
          type: 'object',
          properties: {
            destination: {
              type: 'array',
              destination: {
                type: 'string',
                description: '目的地名稱'
              }
            }
          },
          required: ['destination']
        }
      }
    },
    {
      type: "function",
      function: {
        name: 'google_map_search',
        description: '使用 google map api 搜尋條件',
        parameters: {
          type: 'object',
          properties: {
            querys: 
            {
              type: 'array',
              description: '搜尋條件'
            }
          },
          required: ['querys']
        }
      }
    },

    {
      type: "function",
      function: {
        name: 'find_contact_get_time_estimate',
        description: '尋找聯絡人位置後計算預估時間',
        parameters: {
          type: 'object',
          properties: {
            contacts: {
              type: 'array',
              description: '聯絡人名稱'
            }
          },
          required: ['contacts']
        }
      },
    },
    {
      type: "function",
      function: {
        name: 'send_message_estimate_time',
        description: '傳送訊息給聯絡人，包含預估抵達時間',
        parameters: {
          type: 'object',
          properties: {
            contacts: {
              type: 'array',
              description: '聯絡人名稱'
            }
          },
          required: ['contacts']
        }
      }
    },
    {
      type: "function",
      function: {
        name: "google_map_set_destination",
        description: "使用 google map api 設定目的地",
        parameters: {
          type: "object",
          properties: {
            destination: {
              type: "array",
              destination: {
                type: "string",
                description: "目的地名稱"
              }
            }
          },
          required: ["destination"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: 'google_map_search',
        description: '使用 google map api 搜尋條件',
        parameters: {
          type: 'object',
          properties: {
            querys: {
              type: 'array',
              description: '搜尋條件'
            }
          },
          required: ['querys']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_time',
        description: 'Get the current time in a specific city.',
        parameters: {
          type: 'object',
          properties: {
            city: { type: 'string' }
          },
          required: ['city']
        }
      }
    }
];


// Function to call OpenAI API using Axios
async function callOpenAI(addHistory, conversationId, msg) {

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

      // console.log("Check response from openai api: ", response);
      // if (response.data.choices[0].message.tool_calls.length > 0) {
        
      //   const botMsg = response.data.choices[0].message.content + response.data.choices[0].message.tool_calls[0].function;
      // } else {
      //   const botMsg = response.data.choices[0].message.content;
      // }


      // Handle the response
      console.log("Response from OpenAI:", response.data.choices[0].message.content);
       
      const aiMessage = {
        conversationId: conversationId,
        message: botMsg,
        role: "assistant",
        idx: Date.now() + 1,
        side: "left",
      };

      addMessage(addHistory, aiMessage);

    } catch (error) {
      console.log("Error calling OpenAI API:", error.response?.data || error.message);
    }
}

// Call the function
// callOpenAI();

async function callfastapi(addHistory, conversationId, msg) {
  try {
    // axios.post(url, {user_query: "how are you?"}).then((resolve, reject) => {console.log(resolve.data.text)});

    // const response = await axios.post(
    //     "http://localhost:23456/text/generate",
    //     {

    //       user_query: msg,

    //     },
    //     {
    //       headers: {
    //           "Authorization": `Bearer ${API_KEY}`,
    //           "Content-Type": "application/json"
    //       }
    //     }
    // );
  
    // const botMsg = response.data.text;
    const botMsg = 'GOGOG';

    // const funcname = response.data.choices[0].message.tool_calls[0].function.name 
    // const funcargs = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).contacts;
    // const botMsg = `content: ${content}; funcname: ${funcname}; funcargs: ${funcargs}`

  

    // console.log("Check response from openai api: ", response);
    // if (response.data.choices[0].message.tool_calls.length > 0) {
      
    //   const botMsg = response.data.choices[0].message.content + response.data.choices[0].message.tool_calls[0].function;
    // } else {
    //   const botMsg = response.data.choices[0].message.content;
    // }


    // Handle the response
    // console.log("Response from OpenAI:", response.data);
       
    const aiMessage = {
      conversationId: conversationId,
      message: botMsg,
      role: "assistant",
      idx: Date.now() + 1,
      side: "left",
    };

    addMessage(addHistory, aiMessage);
  } catch(error) {
    console.log("[ERR] calling fast API:", error.response?.data || error.message);
  }
}


async function addMessage(addHistory, message) {
  const payload = {
    collectionName: "ChatMessage",
    data: {
      conversationId: message.conversationId,
      messageId: message.idx,
      user: "yzk",
      role: message.role,
      message: message.message,
      side: message.side,
    },
  };
  try {
    const response = await axios.post(`${MONGO_PROXY_PATH}/add`, payload);
    // const response = await axios.post("/mongodb/add", payload);

    addHistory(message);
    console.log("Add Response:", response.data);
  } catch (error) {
    console.error(
      "Add Error:",
      error.response ? error.response.data : error.message
    );
  }
}

function InputArea({ addHistory, conversationId }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat history
    const userMessage = {
      conversationId: conversationId,
      message: input,
      role: "user",
      idx: Date.now(),
      side: "right",
    };
    addMessage(addHistory, userMessage);
    // addHistory(userMessage);
  
    const collectionName = 'ChatMessage';
    const limit = 20;

    const payload = {
      collectionName: collectionName,
      query: JSON.stringify({ conversationId: conversationId }), 
      limit: limit
    };

    console.log(">>> Check payload: ", payload);

    axios.get(`${MONGO_PROXY_PATH}/messages`, { params: payload })
      .then(mongo_response => {    
        console.log(">>> mongo_response: ", mongo_response);
        const hist_msg = mongo_response.data.data;
        console.log(">>> History Msg: ", mongo_response.data);
        const chat_msg = [];
        for (let i = 0; i < hist_msg.length; i++) {
          chat_msg.push({role: hist_msg[i].role, content: hist_msg[i].message});
        }
        // chat_msg.push(JSON.stringify({role: 'user', content: input}));
        // chat_msg.push({role: 'user', content: input});

        console.log("History: ", chat_msg);

        // callOpenAI(addHistory, conversationId, input);
        // callOpenAI(addHistory, conversationId, chat_msg);
        callfastapi(addHistory, conversationId, "chat_msg");
      })
      .catch(err => {
        console.log(`callOpenAI execution failed!\n${err}`);
      });

    // const mongo_response = axios.get(`${MONGO_PROXY_PATH}/messages`, {
    //   payload
    // });

    
    // const chat_msg = [];
    // for (let i = 0; i < hist_msg.length; i++) {
    //   chat_msg.push({role: hist_msg[i].role, content: hist_msg[i].message});
    // }





    
    // const botMsg = botResponse();

    // const aiMessage = {
    //   conversationId: conversationId,
    //   message: botMsg,
    //   role: "assistant",
    //   idx: Date.now() + 1,
    //   side: "left",
    // };



    // addMessage(addHistory, aiMessage);

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
