// import axios from "axios";
const axios = require('axios'); // Only needed in Node.js; not required in a browser

// Define the OpenAI API URL and key
// const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const PORT = "8000"
const BASE_URL = `http://vllm:${PORT}`;
const OPENAI_API_URL = `${BASE_URL}/v1/chat/completions`;
const API_KEY = "your-openai-api-key";

async function getDeployedModel() {
  try {
    const response = await axios.get(`${BASE_URL}/v1/models`); // Replace with your vLLM API URL
    if (response.data && response.data.data) {
      const models = response.data.data;
      console.log('Available Models:', models);
      if (models.length > 0) {
        console.log('Deployed Model Name:', models[0].id); // Assuming the first model is the primary one
      } else {
        console.log('No models deployed.');
      }
    } else {
      console.log('Unexpected response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching models:', error.message);
  }
}

// Call the function
const MODLE_NAME = getDeployedModel();
console.log(`model name: ${MODLE_NAME}`)

// Function to call OpenAI API using Axios
async function callOpenAI() {
  // const model_name = "/models/Llama-3.2-3B-Instruct";
  // const model_name = "/models/Llama-3.2-1B-Instruct";
  const model_name = "/models/Llama-3.2-1B-EV-1";
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
      tpye: "function",
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
      "tpye": "function",
      "function": {
        "name": 'google_map_search',
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
      "type": 'function',
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
  // console.log(tools);

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        // model: "gpt-3.5-turbo", // Specify the model
        model: model_name, // Specify the model
        messages: [
          // {
          //   role: 'system',
          //   content: 'You are a function-calling assistant. Always use the tools provided.'
          // },
          // { role: "system", content: "You are a helpful assistant with tools." },
          // { role: "user", content: "Tell me a joke." }
          // { role: "user", content: "系統請規劃接曉彤的最佳路徑"}
          // { role: "user", content: "what time is it?"},
          { role: "user", content: "去接承恩，現在立刻出發"},
          // { role: "assistant", content: '{"name": "find_contact_get_time_estimate", "arguments": {"contacts": ["承恩"]}}'},
          // { role: "user", content: "{'Contact_not_found': [], 'Contact_and_estimate_minute': [('杜承恩', 934)]}"}
        ],
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

    // Handle the response
    // console.log(response.data)
    console.log("Response content from OpenAI:", response.data.choices[0].message.content);
    console.log("Response tool_calls from OpenAI:", response.data.choices[0].message.tool_calls, response.data.choices[0].message.tool_calls.length);
    if (response.data.choices[0].message.tool_calls.length > 0) {
      // console.log("Response tool_calls from OpenAI:", response.data.choices[0].message.tool_calls);
      console.log("Response function from OpenAI:", response.data.choices[0].message.tool_calls[0].function);
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
  }
}

// Call the function
callOpenAI();