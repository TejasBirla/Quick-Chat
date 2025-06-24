# 💬 MERN Stack Real-Time Chat App

A full-featured real-time chat application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with **Socket.IO** for live messaging, image sharing via **Cloudinary**, secure **authentication**, and **OTP-based password reset** using **Nodemailer**.

---

## 🔥 Features

✅ User Registration & Login  
✅ OTP Verification for Forgot Password (via Email using Nodemailer)  
✅ JWT Authentication  
✅ Real-Time Messaging with Socket.IO  
✅ Unseen Messages Count (Number Badge)  
✅ Typing Indicator ("Typing..." message)  
✅ Image Messages (Uploaded to Cloudinary)  
✅ Profile Update & Delete Functionality  
✅ MongoDB for Persistent Storage  

---

## 🚀 Technologies Used

### 📦 Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- Cloudinary SDK
- Nodemailer
- dotenv

### 💻 Frontend
- React.js (Hooks, Context API)
- Axios
- Tailwind CSS
- React Router
- Toast Notifications (react-hot-toast)

---

## 🧠 Project Structure

chat-app/
├── client/                    # Frontend (React)
│   ├── context/              # React context for state management
│   ├── node_modules/         # Frontend dependencies
│   ├── public/               # Public assets
│   └── src/                  # Source files
│       ├── assets/          # Images and static files
│       ├── components/      # Reusable UI components
│       ├── lib/             # Helper functions or API utils
│       ├── pages/           # React pages
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/                   # Backend (Node.js + Express)
│   ├── controllers/         # Route handlers
│   ├── lib/                 # Utility files (e.g., DB config)
│   ├── middlewares/        # Express middlewares
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── server.js            # Entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
├── .gitignore
├── vite.config.js           # Vite config for frontend
├── package.json             # Root dependencies
├── README.md


---

## 👨‍💻 About the Developer

**Tejas Birla**
Email: [tejasbirla3@gmail.com]  

Passionate full-stack developer with a focus on building real-time web applications using modern JavaScript technologies like React, Node.js, Express, and Socket.io.
