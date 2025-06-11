import json
import requests
from typing import List

from fastapi import FastAPI, Response, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from pydantic import BaseModel

import numpy as np

# BASE_URL = "http://localhost:9191/tod/ebus/test"
BASE_URL = "http://localhost:9191/tod/ebus/test"


class APIRequest(BaseModel):
    history: str = "empty"
    user_id: str = "yzk"
    conversation_id: str = "test_01"
    user_query: str = "hello world!"
    message_id: int = 0
    temperature: float = 0.2
    max_new_tokens: int = 1024

# Define request structure
class Message(BaseModel):
    role: str
    content: str

class ChatPayload(BaseModel):
    messages: list[Message]
    temperature: float = 0.7
    max_tokens: int = 512

app = FastAPI()

@app.post("/chat")
async def chat(payload: ChatPayload):
    # Convert messages to a single prompt
    BOT_MSGS = [
        "Hi, how are you?",
        "Ohh... I can't understand what you trying to say. Sorry!",
        "I like to play games... But I don't know how to play!",
        "Sorry if my answers are not relevant. :))",
        "I feel sleepy! :("
    ]
    
    # return JSONResponse(content=jsonable_encoder({"response": np.random.choice(BOT_MSGS)}))
    return {
        "response": np.random.choice(BOT_MSGS), 
        "prompt": payload
    }


@app.post("/text/generate")
def text_generation(request: APIRequest): 

    print(request)
    print(request.json())
    
    try:
        final_result = requests.post(BASE_URL, data=request.json()).json()
        # final_result = requests.post(BASE_URL, json=request.json()).json()
        print(final_result)
    except Exception as err_msg:
    
        final_result = {
            "text": f"[ERR] something went wrong call yzk!\n{err_msg}",
            "begin_task": True,
            "tod_intent": json.dumps({"user_intent": "test_api", "tracking_state": {"k1": [1, 2, 3], "k2": [9, 8, 7]}}),
            "tod_summary": json.dumps({"summary": "you are my heart"}),
        }
    
    ### return array
#     return JSONResponse(content=jsonable_encoder([response]))  # get data in python => response.body.decode() 
    ### return object
#     return JSONResponse(content=jsonable_encoder(response))  # get data in python => response.body.decode() 
    return JSONResponse(content=jsonable_encoder(final_result))  # get data in python => response.body.decode() 



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9991)
    #uvicorn.run(app, host=app_config["api"]["host"], port=app_config["api"]["port"])

    import sys
    sys.exit(0)
