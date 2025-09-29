# Crisp: AI-Powered Interview Preparation Platform

Crisp is a modern web application designed to help job seekers prepare for technical interviews. By leveraging AI to parse resumes and generate personalized quizzes, Crisp provides a tailored practice experience that mimics a real screening process.

## About The Project

In today's competitive job market, preparation is key. Crisp was built to bridge the gap between having a good resume and acing the technical interview. It automates the initial screening phase, allowing candidates to practice with questions relevant to their skills while providing recruiters with a streamlined dashboard to view candidate performance.

The platform is divided into two main views: 
- **Interviewee side:** For taking the quiz  
- **Interviewer dashboard:** Secure view for reviewing results

## Key Features

- 🤖 **AI Resume Parsing:** Simply upload a resume (PDF, DOC, DOCX), and our backend extracts the candidate's name and key details to create a profile.  
- 🧠 **Personalized Technical Quiz:** Based on the resume, a timed, multiple-choice quiz is generated to test the candidate's technical knowledge.  
- 📊 **Interviewer Dashboard:** A clean, animated dashboard that lists all candidates, their quiz scores, and provides a quick overview of their performance.  
- 📈 **Performance Analytics:** After completing a quiz, candidates are redirected to a detailed profile page showing their score, accuracy, and an AI-generated summary of their performance.  
- 🔄 **Persistent Sessions:** The application state is saved using Redux Persist, allowing users to refresh the page during a quiz and continue exactly where they left off.  
- 🚀 **Built with Modern Technologies:** A fast, responsive frontend built with React and a robust backend powered by Node.js and Express.

## Built With

This project is built with a modern MERN-like stack:

### Frontend
- React.js  
- Redux Toolkit for state management  
- React Router for navigation  
- Tailwind CSS for styling  
- Vite for the build tool  

### Backend
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- Multer for file uploads  

### Deployment
- The app is designed to be easily containerized with Docker for production.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

- **Node.js:**  
  ```bash
  npm install npm@latest -g
