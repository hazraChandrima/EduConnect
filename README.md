# 🎓 EduConnect

We have developed a **secure, multi-role** web/mobile application tailored for college environments that will serve as a centralized platform for college students, professors, and administrators.

## 📖 Table of Contents  

- [Core Features](#-core-features)  
   - [Authentication and Security](#-authentication-and-security)  
   - [Student-Centric Learning Management](#-student-centric-learning-management)  
   - [Efficient Academic Management](#-efficient-academic-management)  
   - [Intelligent Administrative Control](#%EF%B8%8F-intelligent-administrative-control)  
- [Our Solution](#-our-solution)  
- [Tech Stack](#-tech-stack)  
   - [Why MERN Stack with React Native?](#-why-mern-stack-with-react-native)  
   - [AI Components](#-ai-components)  
- [Installation and Setup](#-installation-and-setup)  
   - [Prerequisites](#-prerequisites)  
   - [Backend Setup](#-backend-setup)  
   - [Frontend Setup](#-frontend-setup)  
   - [EduConnect Chatbot Setup](#-educonnect-chatbot-setup)  
   - [PDF-to-Quiz Generator Setup](#-pdf-to-quiz-generator-setup)  
- [Key Features Explained](#%EF%B8%8F-key-features-explained)    
- [Architecture and Data Flow](#%EF%B8%8F-architecture-and-data-flow)  
- [UI/UX Mockups](#-uiux-mockups)  
- [Contributors](#-contributors)  


## ✨ Core Features:

### 🔒 Authentication and Security
- Using **multi-factor authentication (2FA)** during login
- **Role-Based Access Control** for each user type


### 📚 Student-Centric Learning Management
- Comprehensive **Academic Dashboard** (Curriculum, Marks, Attendance)
- AI-powered **chatbot** for doubt clearing
- AI-powered **quiz generation** from PDF or text prompt
- **Seamless Offline Mode**

### 📊 Efficient Academic Management
- Easily **update marks** and **attendance** through the app in **real-time**
- Evaluate assignments and give **instant feedback** for better learning

### ⚙️ Intelligent Administrative Control
- Dynamic User Role and **System Configuration** Management
- **Controlled Temporary Role Escalation**



## 💡 Our Solution

EduConnect is a comprehensive college management system built with the MERN stack and React Native, providing a seamless experience across web and mobile platforms. The application integrates advanced AI features including a domain-specific chatbot and automated quiz generation from educational materials.

---

## 💻 Tech Stack

### 🤔 Why MERN Stack with React Native?

- **MongoDB**: NoSQL database that provides flexibility for handling various data structures required in an educational platform
- **Express.js**: Minimalist web framework for Node.js that simplifies backend API development
- **React**: Frontend library that enables building interactive user interfaces with reusable components
- **Node.js**: JavaScript runtime that allows for efficient server-side operations
- **React Native**: Framework for building cross-platform mobile applications using React
- **TypeScript**: Adds static typing to JavaScript, improving code quality and developer experience
- **Expo**: Toolkit for React Native that simplifies mobile app development

### 🤖 AI Components

- **OpenAI API + LangChain & FAISS**: For creating a domain-specific chatbot limited to computer science topics
- **OpenAI API**: Powers the quiz generation feature, converting PDFs and text into educational quizzes

---

## 📋 Installation and Setup

### 📝 Prerequisites
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- Python (v3.8 or higher)
- npm or yarn
- Expo CLI

---

### 🔧 Backend Setup

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
   ```

4. Start the backend server (using nodemon):
   ```bash
   npm run dev
   ```
   
   The backend will be available at http://127.0.0:3000/
---

### 📱 Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend/
   npm install
   ```

2. Create a `.env` file with necessary configuration:
   ```
   API_URL=http://localhost:3000/api
   ```

3. Start the React Native development server:
   ```bash
   npx expo start
   ```
   The frontend will be available at http://127.0.0:8081/

---

### 💬 EduConnect Chatbot Setup

1. Install Python dependencies:
   ```bash
   cd eduConnect_chatbot/
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SERPAPI_API_KEY=your_serpapi_api_key
   ```

3. Run the chatbot API:
   ```bash
   python api/app.py
   ```
   The chatbot API will be available at http://127.0.0.1:5000/ask

---

### 📝 PDF-to-Quiz Generator Setup

1. Install Python dependencies:
   ```bash
   cd PDF-text_to_quiz/
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Run the PDF-to-Quiz API:
   ```bash
   uvicorn api_pdf:app --host 127.0.0.1 --port 8000 --reload
   ```
   The PDF-to-Quiz app will be available at http://127.0.0.1:8000/pdf_to_quizz

4. Run the Text-to-Quiz API (in a separate terminal):
   ```bash
   uvicorn api_text:app --host 127.0.0.1 --port 8000 --reload
   ```
   The PDF-to-Quiz app will be available at http://127.0.0.1:8000/text_to_quizz

---

## 🛠️ Key Features Explained

### 🔐 Authentication and Security
- Implemented multi-factor authentication using `speakeasy` and `qrcode` libraries, and `nodemailer` for sending OTP via mail.
- Secure password hashing with `bcrypt`
- JWT-based authentication with role-based access control
- Context-aware authentication analyzes user behavior patterns

### 🤖 AI-Powered Chatbot
- Built using LangChain and FAISS (Facebook AI Similarity Search) vector indexing, enabling efficient similarity search in vector space.
- Implements a RAG (Retrieval-Augmented Generation) architecture for accurate responses
- Optimized for academic queries and student support
- Retrieves information from verified computer science resources before generating responses, otherwise Google/Wikipedia search 

### 📊 PDF-to-Quiz Generator
- Automatically generates quizzes from PDF documents or text prompts
- Uses OpenAI API to extract key concepts and create relevant questions
- Helps instructors create assessment materials efficiently

### 📈 Academic Dashboard
- Comprehensive student performance tracking
- Real-time attendance and grade updates
- Personalized learning analytics

---

## 🏗️ Architecture and Data Flow

<div align="center">
  <img src="https://github.com/user-attachments/assets/c6e0cf77-ebb8-400e-9ea9-b3f30046fce6" width="800" alt="Description">
</div>

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

---

## 📱 UI/UX Mockups

<div align="center">
  <img src="https://github.com/user-attachments/assets/ef8d90fd-0362-434e-8605-6083a6b7e811" width="800" alt="Description">
</div>


## 🤝 Contributors

- [Isha Jayal](https://github.com/ishXD)
- [Ananya Goyal](https://github.com/ananyagoyal0624)
- [Rishika Aggarwal](https://github.com/rishika-on-git)
- [Chandrima Hazra](https://github.com/hazraChandrima)

