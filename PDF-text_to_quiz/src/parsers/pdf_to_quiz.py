import asyncio
import os
from langchain_community.document_loaders import PyPDFLoader
from src.generators.quiz_generator import generate_quizz
from src.utils.ui_utils import transform
import traceback



async def pdf_to_quizz(pdf_file_name, num_questions: int = 5):
    try:
        if not os.path.exists(pdf_file_name):
            raise FileNotFoundError(f"PDF file not found: {pdf_file_name}")
            
        print(f"Processing PDF: {pdf_file_name}, generating {num_questions} questions")
        
        # Load PDF and split pages
        loader = PyPDFLoader(pdf_file_name)
        pages = loader.load_and_split()
        
        if not pages:
            print("No pages were extracted from the PDF")
            return []
            
        print(f"Extracted {len(pages)} pages from PDF")

        sem = asyncio.Semaphore(10)  

        async def process_page(page, page_num):
            async with sem:
                try:
                    print(f"Processing page {page_num+1}")
                    result = await generate_quizz(page.page_content, num_questions)
                    return result if result else [] 
                except Exception as e:
                    print(f"Error processing page {page_num+1}: {str(e)}")
                    return []

        tasks = [process_page(page, i) for i, page in enumerate(pages)]
        questions = await asyncio.gather(*tasks)

        all_questions = []
        for i, question_set in enumerate(questions):
            if question_set: 
                try:
                    print(f"Transforming question set from page {i+1}, containing {len(question_set)} items")
                    
                    if isinstance(question_set, list) and len(question_set) > 0:
                        transformed_questions = transform(question_set[0], num_questions)
                        print(f"Transformed to {len(transformed_questions)} questions")
                        all_questions.extend(transformed_questions)
                    else:
                        print(f"Skipping empty question set from page {i+1}")
                except Exception as e:
                    print(f"Error transforming questions from page {i+1}: {str(e)}")
                    traceback.print_exc()

        print(f"Total questions generated: {len(all_questions)}")
        
        if len(all_questions) > num_questions:
            all_questions = all_questions[:num_questions]
            print(f"Limited to {num_questions} questions as requested")
            
        return all_questions



    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        traceback.print_exc()
        return []