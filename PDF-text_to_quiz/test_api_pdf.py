import requests

url = "http://192.168.142.247:8000/pdf_to_quizz/"

with open("C:\\Users\\Chandrima\\Downloads\\university_schema.pdf", "rb") as pdf_file:

    files = {"file": pdf_file}  
    params = {"num_questions": 5}  

    response = requests.post(url, files=files, params=params)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
