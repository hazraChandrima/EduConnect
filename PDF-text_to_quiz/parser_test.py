import re
from langchain.output_parsers.regex import RegexParser

def transform(input_list):
    """Transforms the parsed output into a structured list of dictionaries."""
    new_list = []
    for i in range(len(input_list) // 6): 
        question_dict = {
            "question": input_list[i * 6],
            "A": input_list[i * 6 + 1],
            "B": input_list[i * 6 + 2],
            "C": input_list[i * 6 + 3],
            "D": input_list[i * 6 + 4],
            "response": input_list[i * 6 + 5],
        }
        new_list.append(question_dict)
    return new_list

def generate_regex_pattern(num_questions):
    """Generates a regex pattern to capture multiple MCQs dynamically."""
    single_question_pattern = (
        r"Question:\s*(.*?)\s*"
        r"CHOICE_A:\s*(.*?)\s*"
        r"CHOICE_B:\s*(.*?)\s*"
        r"CHOICE_C:\s*(.*?)\s*"
        r"CHOICE_D:\s*(.*?)\s*"
        r"Answer:\s*(\w)"
    )

    full_pattern = (single_question_pattern + r"\s*") * num_questions
    output_keys = [f"{key}{i}" for i in range(1, num_questions + 1) for key in ["question", "A", "B", "C", "D", "response"]]
    
    return full_pattern, output_keys



# Input String
input_string = """Question: What is the main contribution of the paper?
CHOICE_A: Introducing a hybrid architecture combining deep learning layers with a final discrete NP-hard Graphical Model reasoning layer
CHOICE_B: Proposing a new loss function that efficiently deals with logical information
CHOICE_C: Using discrete GMs as the reasoning language
CHOICE_D: All of the above
Answer: D

Question: What type of problems can the proposed neural architecture and loss function efficiently learn to solve?
CHOICE_A: Only visual problems
CHOICE_B: Only symbolic problems
CHOICE_C: Only energy optimization problems
CHOICE_D: NP-hard reasoning problems expressed as discrete Graphical Models, including symbolic, visual, and energy optimization problems
Answer: D
"""

num_questions = 2  

regex_pattern, output_keys = generate_regex_pattern(num_questions)

output_parser = RegexParser(
    regex=regex_pattern,
    output_keys=output_keys
)

parsed_output = re.findall(regex_pattern, input_string, re.DOTALL)

flattened_output = [item for sublist in parsed_output for item in sublist]
output_dict = transform(flattened_output)

print(output_dict)
