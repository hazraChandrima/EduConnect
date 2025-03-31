from fastapi import FastAPI
from pydantic import BaseModel
import asyncio
from quizz_generator import generate_quizz
from ui_utils import transform
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    content: str
    num_questions: int

async def txt_to_quizz(content: str, num_questions: int):
    quizz = await generate_quizz(content, num_questions)
    
    if quizz and isinstance(quizz, list) and quizz[0]:
        input_list = quizz[0]

        if isinstance(input_list, list) and isinstance(input_list[0], dict):
            if "question1" in input_list[0]:  
                transformed_quizz = transform(input_list, num_questions)
            else:
                transformed_quizz = input_list  
        else:
            transformed_quizz = []

        return transformed_quizz

    return []

@app.post("/text_to_quizz/")
async def generate_text_quizz(request: QuizRequest):
    return await txt_to_quizz(request.content, request.num_questions)




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
