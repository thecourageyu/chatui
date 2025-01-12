#!/usr/bin/env python
# coding: utf-8

# In[27]:


import json
import requests

from fastapi import FastAPI, Response, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from pydantic import BaseModel

import numpy as np


# In[32]:


BASE_URL = "http://localhost:9191/tod/ebus/test"
BASE_URL = "http://60.251.14.135:23456/text/generate"
BASE_URL = "http://localhost:23456/text/generate"


class APIRequest(BaseModel):
    history: str = "empty"
    user_id: str = "yzk"
    conversation_id: str = "test_01"
    user_query: str = "hello world!"
    message_id: int = 0
    temperature: float = 0.2
    max_new_tokens: int = 1024


# In[33]:


api_request = APIRequest()


# In[34]:


api_request.json()


# In[35]:


result = requests.post(BASE_URL, data=api_request.model_dump_json())


# In[36]:


print(result.json())


# In[ ]:




