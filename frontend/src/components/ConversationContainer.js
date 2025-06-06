import React from "react";

async function addMessage(addHistory, message) {
    const payload = {
      collectionName: "ConversationList",
      data: {
        conversation_id: "1",
        message_id: message.idx,
        user_id: "yzk",
        role: message.role,
        message: message.message,
        side: message.side,
      },
    };
    try {
      const response = await axios.post("/add", payload);
      addHistory(message);
      console.log("Add Response:", response.data);
    } catch (error) {
      console.error(
        "Add Error:",
        error.response ? error.response.data : error.message
      );
    }
  }

function ConversationContainer({addConversation, deleteConversation, setSelectedConversationId, conversationList: conversationList }) {

    const handleClick = () => {
        addConversation();
        addMessage();
    };

    return (

        <div style={{ width: "25%", background: "#f0f0f0", padding: "10px" }}>
            <button onClick={() => handleClick} style={{ marginBottom: "10px" }}>
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
                    onClick={() => setSelectedConversationId(conv.id)}
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
    );
};

export default ConversationContainer;