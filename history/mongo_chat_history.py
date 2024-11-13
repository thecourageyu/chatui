import json
import logging
from dataclasses import asdict
from typing import List, Optional
from .chat_history import BaseMessage, BaseChatMessageHistory

# from langchain_core.chat_history import BaseChatMessageHistory
# from langchain_core.messages import (
#     BaseMessage,
#     message_to_dict,
#     messages_from_dict,
# )

# from langchain_community.utilities.redis import get_client

logger = logging.getLogger(__name__)


# class RedisChatMessageHistory(BaseChatMessageHistory):
class MongoChatMessageHistory(BaseChatMessageHistory):    
    """Chat message history stored in a Mongo collection."""

    def __init__(
        self,
        user_id: str,
        session_id: Optional[str] = None,
        url: str = "mongodb://localhost:27017/",
        username: str = "root",
        password: str = "root123",
        database_name: str = "city_gpt",
        # key_prefix: str = "conversation_id",
        ttl: Optional[int] = None,
    ):
        try:
            # import redis
            import pymongo
        except ImportError:
            raise ImportError(
                "Could not import pymongo python package. "
                "Please install it with `pip install pymongo`."
            )

        try:
            # self.redis_client = get_client(redis_url=url)
            self.mongo_client = pymongo.MongoClient(url, username=username, password=password)
        except Exception as error:
            logger.error(error)

        self.session_id = session_id
        # self.key_prefix = key_prefix
        self.key = {"user_id": user_id, "session_id": session_id} if session_id is not None else {"user_id": user_id}
        self.ttl = ttl

        if database_name not in self.mongo_client.list_database_names():
            print("create database: {}".format(database_name))    
            
        self.db = self.mongo_client[database_name]
        
        if "message_store" not in self.db.list_collection_names():
            # print("create collection: message_store & index: user_id and session_id")
            print("create collection: message_store")
            self.collection = self.db["message_store"]
            # self.collection.create_index("conversation_id", unique=True)
        else:
            self.collection = self.db["message_store"]        
    
    # @property
    # def key(self) -> str:
    #     """Construct the record key to use"""
    #     return {self.key_prefix: self.session_id}

    @property
    def session_exists(self) -> int:
        return self.collection.count_documents(self.key)

    def initialize_session(self):
        conversation = {}
        conversation.update(self.key)
        conversation.update({"messages": []})    
        self.collection.insert_one(conversation) 
    
    @property
    def messages(self) -> List[BaseMessage]:  # type: ignore
        """Retrieve the messages from Mongo"""
        if not self.session_exists:
            self.initialize_session()
        
        messages = self.collection.find_one(self.key)["messages"]
        return messages

    def add_message(self, message: BaseMessage) -> None:
        """Append the message to the record in Mongo"""
        self.collection.find_one_and_update(
            self.key,
            {"$push": {"messages": asdict(message)}}
        )

    def clear(self) -> None:
        """Clear session memory from Mongo"""
        
        self.collection.delete_one(self.key)
        self.initialize_session()
        