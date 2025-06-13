import { useState } from "react";
import axios from "axios";

import "./InputArea.css";

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

async function callFastAPI(addHistory, conversationId, msg) {

  // axios.post(url, {user_query: "how are you?"}).then((resolve, reject) => {console.log(resolve.data.text)});
  // const url = "http://localhost:23456/text/generate";

  // The API "http://host.docker.internal:9991/chat" can be called from within the container using the terminal, 
  // but it cannot be accessed from the web service running inside the same container—it only results in a timeout error.
  //
  // host.docker.internal is a special DNS name only usable from inside Docker containers.
  // It does not work from a browser, which is running outside Docker (i.e., your host OS).
  // When your browser hits http://host.docker.internal:9991, it cannot resolve the address or connect — hence timeout.
  // 
  // Fix: Use http://localhost:9991 in browser
  const url = "http://localhost:9991/chat";  // access DGX API by local port forwarding from within a Docker container 
  const payload = {
    messages: msg,
    temperature: 0.7,
    max_tokens: 2048
  };
  
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
    console.log("Check response from fastapi: ", response);
    const botMsg = response.data.response;
    // const botMsg = response.data.text;
    // const botMsg = 'GOGOG';

    // const funcname = response.data.choices[0].message.tool_calls[0].function.name 
    // const funcargs = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments).contacts;
    // const botMsg = `content: ${content}; funcname: ${funcname}; funcargs: ${funcargs}`

    console.log("Check response from fastapi: ", response);

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

  const collectionName = 'ChatMessage';
  const limit = 20;  // Tracking conversation turns


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat history
    const userMessage = {
      conversationId: conversationId,
      // userId: userId,
      message: input,
      role: "user",
      idx: Date.now(),
      side: "right",
    };
    addMessage(addHistory, userMessage);
    // addHistory(userMessage);
  
//     const system_prompt = `你是一個智能規劃助理，能理解用戶的複雜需求並自動規劃任務流程。\n
// 你的任務是將用戶的自然語言問題，逐步拆解為邏輯明確的子任務。\n
// \n
// 請遵守以下原則：\n
// \n
// 1. 將複雜問題拆解為明確的子任務。\n
// 2. 將每一步的輸出視為後續步驟的輸入，直到任務完成。\n
// \n
// 請使用以下格式進行輸出：\n
// plan_1<hhev_split>plan_2<hhev_split>plan_3\n
// \n
// 請保持條理清晰、步驟合理。`;

    const system_prompt = `"""你是一個智能規劃助理，能理解用戶的複雜需求並自動規劃任務流程。 你的任務是將用戶的自然語言問題，逐步拆解為邏輯明確的子任務，並根據可用工具（Tool/Function）選擇最適合的方式來完成每一步。 
    [api-1] def handle_miscellaneous_task(user_query, ...): 
        使用者提出非自動座艙助理應處理的的請求時給予禮貌且簡潔的回應，例如使用者閒聊、刻意冒犯或提出危險想法等，但不要回答政治、醫療、法律或財經等議題，不要接受違反資安規定的指令。 
        Parameters: - name (str): 聯絡人名稱 
        Returns: - dict: { response (str): 文字回應 } 
    
    [api-2] def get_phonebook(name, ...): 
        查詢通訊錄內是否存在指定聯絡人，若無則回傳空字串 
        Parameters: - name (str): 聯絡人名稱 
        Returns: - dict: { name (str): 聯絡人名稱, phone (str): 聯絡人電話號碼 } 
    
    [api-3] def save_phonebook(name, phone, ...): 
        儲存新聯絡人資訊到通訊錄 
        Parameters: - name (str): 聯絡人名稱 - phone (str): 聯絡人電話號碼 
        Returns: - dict: { result (str): 文字回應, ex. 已儲存{name}電話號碼{phone}... } 
        
    [api-4] def search_place(destination, ...): 
        根據地名搜尋並回傳完整地址及 GPS 坐標，或候選列表 
        Parameters: - destination (str): 目的地 
        Returns: - dict: { destination (str): 目的地, address (str): 地址, gps (str): GPS座標 } 
        
    [api-5] def pickup_start(name, phone, address, ...): 
        發起接駁任務並發送通知簡訊 
        Parameters: - name (str): 聯絡人名稱 - phone (str): 聯絡人電話號碼 - address (str): 地址 
        Returns: - dict: { result (str): 文字回應, ex. 簡訊已發送給{person}... } 
        
    [api-6] def nav_start(address, ...): 
        啟動導航至指定地址 
        Parameters: - address (str): 地址 
        Returns: - dict: { result (str): 文字回應, ex. 已為您開始導航，目的地為{address}... } 
        
    [api-7] def message_update(name, phone, message, ...): 
        更新乘客通知簡訊內容 
        Parameters: - name (str): 聯絡人名稱 - phone (str): 聯絡人電話號碼 - message (str): 簡訊內容 
        Returns: - dict: { result (str): 文字回應, ex. 接駁任務已完成... } 
        
請遵守以下原則： 
1. 將複雜問題拆解為明確的子任務。 
2. 為每個子任務選擇合適的函數或工具。 
3. 將每一步的輸出視為後續步驟的輸入，直到任務完成。 
4. 如果需要搜尋地點、路線規劃、聯絡人搜尋、簡訊發送等，可調用指定的工具。 
5. 不要調用不存在的工具 

請使用以下格式進行輸出： 
plan_1<hhev_i>(args...)<hhev_end><hhev_split>plan_2<hhev_j>(args...)<hhev_end><hhev_split>plan_3<hhev_k>(args...)<hhev_end> 請保持條理清晰、步驟合理，並善用工具提升效率。"""`;

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
        const chat_msg = [{role: "system", content: system_prompt}];
        for (let i = 0; i < hist_msg.length; i++) {
          chat_msg.push({role: hist_msg[i].role, content: hist_msg[i].message});
        }
        // chat_msg.push(JSON.stringify({role: 'user', content: input}));
        // chat_msg.push({role: 'user', content: input});

        console.log("History: ", chat_msg);

        // callOpenAI(addHistory, conversationId, input);
        // callOpenAI(addHistory, conversationId, chat_msg);
        callFastAPI(addHistory, conversationId, chat_msg);
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
