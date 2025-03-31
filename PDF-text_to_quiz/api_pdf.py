from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import asyncio
import tempfile
from pdf_to_quizz import pdf_to_quizz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/pdf_to_quizz/")
async def generate_quiz_from_pdf(
    file: UploadFile = File(...), 
    num_questions: int = Query(5, ge=1, le=20)  
):
    try:
        suffix = os.path.splitext(file.filename)[1].lower()
        if suffix != '.pdf':
            raise HTTPException(status_code=400, detail="File must be a PDF")

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            # Save the uploaded file to the temporary file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # Process the PDF and generate quiz
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



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="192.168.142.247", port=8000, reload=True)