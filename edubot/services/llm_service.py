from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from config import OPENAI_API_KEY, logger


# initialize LLM models
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, openai_api_key=OPENAI_API_KEY)

logger.info("OpenAI models initialized")




# LLM promptss
classify_prompt = PromptTemplate(
    template="""
Decide whether the following question is personal (i.e., it is asking about the student's own academic records like their marks, courses, attendance, CGPA, remarks, asssignments and assignment submissions).
Every user is defined a role whether professor, student, admin this is also a personal query to ask about role 

`users`: `_id`, `email`, `name`, `cg`, `role`, `hasAccess`  
`courses`: `_id`, `code`, `title`, `description`, `professor`, `students`, `department`, `credits`, `progress`
`marks`: `_id`, `studentId`, `courseId`, `title`, `score`, `maxScore`, `type`, `feedback`, `createdAt` 
`attendances`: `_id`, `studentId`, `courseId`, `date`, `status`  
`professorremarks`: `_id`, `studentId`, `courseId`, `text` 
`assignments`: `_id`, `title`, `description`, `courseId`, `dueDate`, `status`
`assignmentsubmissions` : `assignmentId`, `courseId`, `uploader`, `grade`, `feedback`, `status`

Return only **true** if it is personal. Return nothing otherwise.

Question: {question}
Response:
""",
    input_variables=["question"]
)





query_prompt = PromptTemplate(
    template="""
You are an expert MongoDB query assistant.

Your job is to take a natural language question from a student and generate an accurate MongoDB aggregation pipeline query using these collections:
- `users`
- `courses`
- `marks`
- `attendances`
- `professorremarks`
- `assignments`
- `assignmentsubmissions`

SCHEMA:
`users`: `_id`, `email`, `name`, `cg`, `role`, `hasAccess`  
`courses`: `_id`, `code`, `title`, `description`, `professor`, `students`, `department`, `credits`, `progress`
`marks`: `_id`, `studentId`, `courseId`, `title`, `score`, `maxScore`, `type`, `feedback`, `createdAt` 
`attendances`: `_id`, `studentId`, `courseId`, `date`, `status`  
`professorremarks`: `_id`, `studentId`, `courseId`, `text` 
`assignments`: `_id`, `title`, `description`, `courseId`, `dueDate`, `status`
`assignmentsubmissions` : `assignmentId`, `courseId`, `uploader`, `grade`, `feedback`, `status`

RULES:
- Return a VALID JSON-formatted aggregation pipeline (as Python list of dicts).
- **Keys and field names must be wrapped in double quotes**.
- Do NOT include markdown, triple backticks, or explanation text.
- Filter using the given student email.
- Always follow this format

Example format:
[
  {{
    "$match": {{
      "email": "example@student.com"
    }}
  }},
  {{
    "$project": {{
      "role": 1
    }}
  }}
]

Question: {question}  
Email: {email}  
MongoDB Aggregation Query:
""",
    input_variables=["question", "email"]
)






answer_prompt = PromptTemplate(
    template="""
You are a helpful assistant. Convert the following MongoDB result into a clear human-readable answer.

Question: {question}
Raw Result: {result}

Answer:
""",
    input_variables=["question", "result"]
)





fallback_prompt = PromptTemplate(
    template="""
You are a helpful assistant. Please answer the following question briefly and clearly.

Question: {question}

Answer:
""",
    input_variables=["question"]
)




# Create chains
fallback_chain = fallback_prompt | llm
query_chain = query_prompt | llm
answer_chain = answer_prompt | llm
classify_chain = classify_prompt | llm




# Determine if a question is asking for personal information
def is_personal_query(question):
    classification = classify_chain.invoke({"question": question}).content.strip().lower()
    logger.info(f"Classification: {classification}")
    return classification == "true"



# Generate a MongoDB query from a natural language question
def generate_mongo_query(question, email):
    generated = query_chain.invoke({"question": question, "email": email})
    return generated.content.strip()



# Format MongoDB query results into a human-readable answer
def format_query_response(question, result):
    response = answer_chain.invoke({
        "question": question,
        "result": result
    })
    return response.content.strip()



# Get a fallback response when no personal data is found
def get_fallback_response(question):
    response = fallback_chain.invoke({"question": question})
    return response.content.strip()