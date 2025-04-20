
def transform(input_list, num_questions: int):
    """
    Transforms the input list of questions into a standardized format.

    Args:
        input_list (list): List of dictionaries containing question data.
        num_questions (int): Number of questions to process.

    Returns:
        list: List of dictionaries in the standardized format.
    """
    if input_list and "question" in input_list[0]:  
        print("DEBUG: Already transformed, returning as-is.")
        return input_list  

    new_list = []
    for item in input_list:
        if isinstance(item, dict):
            for i in range(1, num_questions + 1):
                question_key = f"question{i}"
                if question_key in item:
                    question_dict = {
                        "question": item[f"question{i}"],
                        "A": item[f"A_{i}"],
                        "B": item[f"B_{i}"],
                        "C": item[f"C_{i}"],
                        "D": item[f"D_{i}"],
                        "reponse": item[f"reponse{i}"]
                    }
                    new_list.append(question_dict)
    
    return new_list