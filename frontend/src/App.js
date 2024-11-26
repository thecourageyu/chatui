
import ChatUI from "./components/ChatUI";
import axios from "axios";

// https://github.com/darenge5965/reactSimpleTodo/blob/main/src/components/CreateForm.jsx

// Add data
async function addMessage() {

  const payload = {
      collectionName: 'YZK01',
      data: {
          conversation_id: "1",
          message_id: 1,
          user_id: "yzk",
          role: "user",
          message: 'how are you',
          age: null
      }
  };
  try {
      const response = await axios.post('/add', payload);
      console.log("Add Response:", response.data);
  } catch (error) {
      console.error("Add Error:", error.response ? error.response.data : error.message);
  }
}

// Get data
export async function getMessages(collectionName, query, limit) {
  try {
      // const params = {
      //     collectionName: "YZK01",
      //     query: JSON.stringify({ conversation_id: "1" }),
      //     limit: 10
      // };
      const params = {
          collectionName: collectionName,
          query: JSON.stringify(query),
          limit: limit
      };
      console.log("Get params:", params);

      const response = await axios.get('/messages', {
          params
      });
      console.log('Request URL:', response.config.url);

      console.log("Get Response:", response.data.data);
  } catch (error) {
      console.error("Get Error:", error.response ? error.response.data : error.message);
  }
}

// Drop collection
async function dropCollection() {
  const payload = { collectionName: "YZK02" }
  try {
      const response = await axios.delete('/drop', {
          data: payload,

      });
      console.log("Drop Response:", response.data);
  } catch (error) {
      console.error("Drop Error:", error.response ? error.response.data : error.message);
  }
}

// Example usage
(async () => {
  await addMessage();
  await getMessages("YZK01", { conversation_id: "1" }, 10);
  await dropCollection();
})();

console.log("YYYYYYYYYYYYYYY");
const msg = getMessages("YZK01", { conversation_id: "1" }, 10);
console.log(msg);

function App() {
  return (
    <>
      <ChatUI />
    </>
  );
}

export default App;
