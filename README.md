# 🎓 EduConnect

We have developed a **secure, multi-role** web/mobile application tailored for college environments that will serve as a centralized platform for college students, professors, and administrators.

## Table of Contents  

- [Core Features](#core-features)  
   - [Authentication and Security](#-authentication-and-security)  
   - [Student-Centric Learning Management](#-student-centric-learning-management)  
   - [Efficient Academic Management](#-efficient-academic-management)  
   - [Intelligent Administrative Control](#%EF%B8%8F-intelligent-administrative-control)  
- [Our Solution](#-our-solution)  
- [Tech Stack](#tech-stack)  
   - [Why MERN Stack with React Native?](#-why-mern-stack-with-react-native)  
   - [AI Components](#ai-components)  
- [Installation and Setup](#installation-and-setup)  
   - [Prerequisites](#-prerequisites)  
   - [Backend Setup](#%EF%B8%8F-backend-setup)  
   - [Frontend Setup](#%EF%B8%8F-frontend-setup)  
   - [EduConnect Chatbot Setup](#%EF%B8%8F-educonnect-chatbot-setup)  
   - [PDF-to-Quiz Generator Setup](#%EF%B8%8F-pdf-to-quiz-generator-setup)  
- [Key Features Explained](#%EF%B8%8F-key-features-explained)    
- [Architecture](#architecture)  
- [UI/UX Mockups](#uiux-mockups)  
- [Contributors](#-contributors)  


## Core Features:

### 🔒 Authentication and Security
- Using **multi-factor authentication (2FA)** during login
- **Role-Based Access Control** for each user type


### 📚 Student-Centric Learning Management
- Comprehensive **Academic Dashboard** (Curriculum, Marks, Attendance)
- Database-Augmented LLM chatbot for **personalized** student assistance
- AI-powered **quiz generation** from PDF or text prompt
- **Seamless Offline Mode**

### 📊 Efficient Academic Management
- Easily **update marks** and **attendance** through the app in **real-time**
- Evaluate assignments and give **instant feedback** for better learning

### ⚙️ Intelligent Administrative Control
- Dynamic User Role and **System Configuration** Management
- **Controlled Temporary Role Escalation**



## 💡 Our Solution

EduConnect is a comprehensive college management system built with the MERN stack and React Native, providing a seamless experience across web and mobile platforms. The application integrates advanced AI features including a personalized chatbot for students and automated quiz generation from educational materials.

---

## Tech Stack

### 🤔 Why MERN Stack with React Native?

- **MongoDB**: NoSQL database that provides flexibility for handling various data structures required in an educational platform
- **Express.js**: Minimalist web framework for Node.js that simplifies backend API development
- **React**: Frontend library that enables building interactive user interfaces with reusable components
- **Node.js**: JavaScript runtime that allows for efficient server-side operations
- **React Native**: Framework for building cross-platform mobile applications using React
- **TypeScript**: Adds static typing to JavaScript, improving code quality and developer experience
- **Expo**: Toolkit for React Native that simplifies mobile app development


### AI Components

- **OpenAI API + Database-Augmented LLM Architecture**: For creating a student-specific chatbot that directly queries academic records
- **OpenAI API**: Powers the quiz generation feature, converting PDFs and text into educational quizzes

---

## Installation and Setup

### ✅ Prerequisites
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- Python (v3.8 or higher)
- npm or yarn
- Expo CLI

---

### ⚙️ Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/hazraChandrima/EduConnect.git
   cd EduConnect/
   ```

2. Install backend dependencies:
   ```bash
   cd backend/
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000

   JWT_SECRET=your_jwt_secret

   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password

   IP_ADDRESS=your_local_ip_address

   ```

4. Start the backend server (using nodemon):
   ```bash
   npm run dev
   ```
   
   The backend will be available at http://127.0.0.1:3000/

---


### ⚙️ Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend/
   npm install
   ```

2. Configure environment variables:
   
   Create two configuration files in the root of your frontend project (cuz Expo with Typescript doesn't support .env fr some reason) :

   **a. app-config.js**
   ```typescript
   // app-config.js
   // This file contains API URLs for different services

   const IP_ADDRESS = "YOUR_LOCAL_IP_ADDRESS"

   export const APP_CONFIG = {
     API_BASE_URL: `http://${IP_ADDRESS}:3000`,
     API_CHATBOT_URL: `http://${IP_ADDRESS}:5000`,
     API_PDF_QUIZ_URL: `http://${IP_ADDRESS}:8000`,
   };
   ```

   **b. firebase-config.ts**
   ```typescript
   // firebase-config.ts
   // This file contains your Firebase configuration
   export const FIREBASE_CONFIG = {
     apiKey: "YOUR_FIREBASE_API_KEY",
     authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
     projectId: "YOUR_FIREBASE_PROJECT_ID",
     storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
     messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
     appId: "YOUR_FIREBASE_APP_ID",
     measurementId: "YOUR_FIREBASE_MEASUREMENT_ID"
   };
   ```
   
   > **Note:** Add these configuration files to your `.gitignore`.

3. Start the React Native development server:
   ```bash
   npx expo start
   ```
   The frontend will be available at http://127.0.0.1:8081/


---

### ⚙️ EduConnect Chatbot Setup

1. Install Python dependencies:
   ```bash
   cd edubot/
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SERPAPI_API_KEY=your_serpapi_api_key
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Run the chatbot API:
   ```bash
   python app.py
   ```

   The chatbot API will be available at http://127.0.0.1:5000/ask

---

### ⚙️ PDF-to-Quiz Generator Setup

1. Install Python dependencies:
   ```bash
   cd PDF-text_to_quiz/
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

3. If you want to run both the functionalities separately:

   - Run the PDF-to-Quiz API:
   ```bash
   uvicorn api_pdf:app --host 127.0.0.1 --port 8000 --reload
   ```
   The PDF-to-Quiz app will be available at http://127.0.0.1:8000/pdf_to_quizz

   - Run the Text-to-Quiz API:
   ```bash
   uvicorn api_text:app --host 127.0.0.1 --port 8001 --reload
   ```
   The Text-to-Quiz app will be available at http://127.0.0.1:8001/text_to_quizz


   **OR** If you want to run both the functionalities simultaneously (on a single port):

   - Run the Text-to-Quiz API:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The PDF/Text-to-Quiz app will be available at http://127.0.0.1:8000/


---

## 🛠️ Key Features Explained

### Authentication and Security
- Implemented multi-factor authentication using `speakeasy` and `qrcode` libraries, and `nodemailer` for sending OTP via mail.
- Secure password hashing with `bcrypt`
- JWT-based authentication with role-based access control
- Context-aware authentication analyzes user behavior patterns

### AI-Powered Chatbot
- Implements a Database-Augmented LLM architecture that translates natural language into MongoDB queries
- Intelligently classifies queries to determine when to access personal student data
- Maintains a semantic similarity cache for efficient responses to common questions
- Features a fallback system for general knowledge questions not requiring personal data


### PDF-to-Quiz Generator
- Automatically generates quizzes from PDF documents or text prompts
- Uses OpenAI API to extract key concepts and create relevant questions
- Helps instructors create assessment materials efficiently

### Academic Dashboard
- Comprehensive student performance tracking
- Real-time attendance and grade updates
- Personalized learning analytics

---

## Architecture

<div align="center">
  <img src="https://github.com/user-attachments/assets/c6e0cf77-ebb8-400e-9ea9-b3f30046fce6" width="800" alt="Description">
</div>



### 🧩 Monorepo Structure
This repository follows a monorepo architecture — all four core modules of EduConnect are maintained within this single repository:

- Backend API Service (/backend)
- LLM Chatbot Service (/edubot)
- Quiz Generator Service (/PDF-text_to_quiz)
- Frontend Web & Mobile App (/frontend)

📌 The Architecture diagram above visually highlights how these modules interact.


<!--
<br/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/07c0c3af-95d4-43ab-8dbe-4b651f487458" width="800" alt="Description">
</div>



### The application follows a microservices architecture:
- Backend API service (Express.js)
- Authentication service
- AI chatbot service (Python/FastAPI)
- Quiz generator service (Python/FastAPI)
- Frontend web application (React)
- Mobile application (React Native)

-->


## UI/UX Mockups

<div align="center">
  <img src="https://github.com/user-attachments/assets/ef8d90fd-0362-434e-8605-6083a6b7e811" width="800" alt="Description">
</div>


## 🤝 Contributors

- [Isha Jayal](https://github.com/ishXD)
- [Ananya Goyal](https://github.com/ananyagoyal0624)
- [Rishika Aggarwal](https://github.com/rishika-on-git)
- [Chandrima Hazra](https://github.com/hazraChandrima)

