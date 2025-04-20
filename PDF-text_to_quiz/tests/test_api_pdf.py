import os
import requests
from dotenv import load_dotenv

load_dotenv()


IP_ADDRESS = os.getenv("IP_ADDRESS")
url = f"http://{IP_ADDRESS}:8000/pdf_to_quizz/"
print(url)


with open("./sample_files/vim_commands.pdf", "rb") as pdf_file:

    files = {"file": pdf_file}  
    params = {"num_questions": 5}  

    response = requests.post(url, files=files, params=params)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
