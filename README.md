# QuizSpark 🚀

**Full-Stack Quiz Application**

A modern, scalable quiz application built with **React**, **Node.js**, and **MongoDB**.

---

## 🚀 Features

- 🔐 **JWT-based authentication** (login & signup)
- 📚 **Dynamic quiz categories**
- ✏️ **Full CRUD operations** for questions
- 🎯 **Interactive quiz gameplay**
- 📊 **Score tracking and analytics**
- 🏆 **Global & category-wise leaderboards**
- 🔍 **Review mode** with explanations
- 🧑‍💼 **Admin panel** for content management
- 📱 **Fully responsive UI** (mobile-first)
- 🎮 **Gamification features** (progress & stats)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit / Context API
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Visualization:** Chart.js

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Auth:** JWT & bcryptjs
- **Validation:** express-validator

### Deployment
- **Frontend:** Vercel / Netlify
- **Backend:** Render / Railway
- **Database:** MongoDB Atlas

---

## 📁 Project Structure

```bash
QuizSpark/
├── frontend/          # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── backend/           # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
│
└── README.md
```
## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd QuizSpark
```
2️⃣ Install dependencies
```bash
# Backend Setup
cd backend
npm install

# Frontend Setup

cd ../frontend
npm install
```
🔐 Environment Setup
```bash
# Backend (backend/.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Frontend (frontend/.env)
VITE_API_URL=https://your-backend-url.onrender.com
```

⚠️ Never commit .env files to GitHub

▶️ Running the Project Locally
```bash
# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```
📚 API Endpoints
Authentication

- POST /api/auth/register

- POST /api/auth/login

- GET /api/auth/profile

- PUT /api/auth/profile

Categories

- GET /api/categories

- POST /api/categories (Admin)

- PUT /api/categories/:id (Admin)

- DELETE /api/categories/:id (Admin)

Questions

- GET /api/questions

- POST /api/questions (Admin)

- PUT /api/questions/:id (Admin)

- DELETE /api/questions/:id (Admin)

Quizzes

- POST /api/quizzes/start

- POST /api/quizzes/submit

- GET /api/quizzes/history

- GET /api/quizzes/:id/review

Leaderboard

- GET /api/leaderboard/global

- GET /api/leaderboard/category/:id

🧭 Roadmap

 - Project setup

 - Authentication system

 - Quiz gameplay logic

 - Admin dashboard

 - Analytics & leaderboards

 - Production deployment

🤝 Contributing

- Fork the repository

- Create a feature branch (git checkout -b feature/your-feature)

- Commit your changes

- Push to the branch

- Open a Pull Request

📄 License

This project is licensed under the MIT License.
