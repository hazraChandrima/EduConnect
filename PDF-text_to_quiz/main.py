from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import tempfile
import asyncio
from pdf_to_quizz import pdf_to_quizz
from quizz_generator import generate_quizz
from ui_utils import transform

app = FastAPI() # using a single fastapi instance to manage both the apis simultaneously

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# PDF to Quiz Endpoint
@app.post("/pdf_to_quizz/")
async def generate_quiz_from_pdf(
    file: UploadFile = File(...), 
    num_questions: int = Query(5, ge=1, le=20)  # Validate num_questions with min/max values
):
    try:
        suffix = os.path.splitext(file.filename)[1].lower()
        if suffix != '.pdf':
            raise HTTPException(status_code=400, detail="File must be a PDF")

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        try:
            print(f"Starting quiz generation from {file.filename} with {num_questions} questions")
            questions = await pdf_to_quizz(temp_file_path, num_questions)
            
            if not questions:
                return {"questions": [], "message": "No questions could be generated"}
                
            print(f"Successfully generated {len(questions)} questions")
            return {"questions": questions}
            
        finally:
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")





# Text to Quiz Endpoint
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

