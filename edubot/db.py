from pymongo import MongoClient
from config import MONGODB_URI, logger

# initialize connection
client = MongoClient(MONGODB_URI)
db = client["test"]

# collections in MongoDB cluster
user_collection = db["users"]
courses_collection = db["courses"]
marks_collection = db["marks"]
attendance_collection = db["attendances"]
remarks_collection = db["professorremarks"]
assignments_collection = db["assignments"]
assignment_submission_collection = db["assignmentsubmissions"]



all_collections = [
    user_collection, 
    courses_collection, 
    marks_collection, 
    attendance_collection, 
    remarks_collection, 
    assignments_collection, 
    assignment_submission_collection
]


logger.info("MongoDB collections initialized")