import asyncio
from quizz_generator import generate_quizz
from ui_utils import transform

async def txt_to_quizz(content, num_questions):
    quizz = await generate_quizz(content, num_questions)
    
    if quizz is not None and quizz:  
        input_list = quizz[0]  

        if isinstance(input_list, list) and input_list and isinstance(input_list[0], dict):
            if "question1" in input_list[0]:  
                transformed_quizz = transform(input_list, num_questions)
            else:
                transformed_quizz = input_list 
        else:
            transformed_quizz = []  

        return transformed_quizz

    return ''

