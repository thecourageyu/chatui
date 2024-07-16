import json
import requests
from django.shortcuts import render, get_list_or_404
from pydantic import BaseModel


# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

class APIRequest(BaseModel):
    user_id: str
    conversation_id: str
    user_query: str = "hello world!"
    message_id: int = 0
    temperature: float = 0.2
    max_new_tokens: int = 2048

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

# @api_view(['POST'])
def model_response(request):
    url = "http://10.39.72.43:23456/text/generate"
    
    # print(request, "<<<<<<<<<<<<<<<<<<<<<< request model response", type(request))
    # response = requests.post(url=url, json=request)
    # print(response)
    # return json.loads(response.content.decode())
    return Response({'user_intent': 'Hello, world!'})
    
