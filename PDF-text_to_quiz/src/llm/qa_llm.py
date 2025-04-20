import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI  

load_dotenv()

# from langchain_openai import ChatOpenAI

class QaLlm():
    def __init__(self) -> None:
        self.llm = ChatOpenAI(
            temperature=0, 
            model_name="gpt-3.5-turbo",
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

    def get_llm(self):
        return self.llm


