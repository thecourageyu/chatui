from pydantic import BaseModel
from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

@api_view(['POST'])
def llm_response(request):
    # print(request.json)
    print(request)
    print(request.body, "<<<<<<<<<<<<<< body")
    return Response({'content': 'Hello, world!'})