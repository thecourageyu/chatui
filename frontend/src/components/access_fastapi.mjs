const FASTAPI_URL = "http://localhost:23456/text/generate";


async function callFastAPI(conversationId, msg) {

    // Example JavaScript code to send a POST request to a Python API
    // const data = {
    //   name: "John Doe",
    //   age: 30
    // };
    
    const data = {
      history: "empty",
      user_id: "yzk",
      conversation_id: conversationId,
      user_query: msg,
      message_id: 0,
      temperature: 0.2,
      max_new_tokens: 1024
    };

    
    fetch(FASTAPI_URL, { // Replace with your Python API URL
      method: "POST",
      headers: {
          "Content-Type": "application/json", // Ensure the server knows the data format
      },
      body: JSON.stringify(data), // Convert the object to a JSON string
    })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // const botMsg = response.data.choices[0].message.content;
          
    
          return response.json(); // Parse JSON response
          
    
      })
      .then(data => {
            const botMsg = data;

            const aiMessage = {
                conversationId: conversationId,
                message: botMsg.toString(),
                role: "assistant",
                idx: Date.now() + 1,
                side: "left",
            };
        //   addMessage(addHistory, aiMessage);
          console.log("Success:", botMsg); // Handle the API response
      })
      .catch(error => {
          console.error("Error:", error); // Handle errors
      });
};


callFastAPI("123", "Hello world!");