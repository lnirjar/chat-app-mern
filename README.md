# 💬 Chat App (MERN)

A full-featured **team chat application** built with the **MERN stack** and **TypeScript**, designed for work-related communication.  
It supports **workspaces**, **group chats**, and **direct messages**, aiming to provide a Slack-like experience with a clean and responsive UI.

## 🚀 Live Demo

🌐 **Live URL:** [https://chat-app-mern-0pdu.onrender.com](https://chat-app-mern-0pdu.onrender.com)  
💻 **GitHub Repo:** [https://github.com/lnirjar/chat-app-mern](https://github.com/lnirjar/chat-app-mern)

## ✨ Features

- 🏢 **Workspaces** — Organize conversations by workspace
- 💬 **Group Chats & DMs** — Chat with teams or individuals in real time
- 🔗 **Invite Members** — Share invitation links to add people to workspaces
- 👥 **Workspace Members List** — See all members within a workspace
- 👤 **Profile & Account Settings** — Update user info and preferences
- 🔒 **Authentication** — Local and Google OAuth via Passport.js
- 🖼️ **User Avatars** — Profile pictures stored using Cloudinary
- 🌙 **Dark Mode Toggle** — Seamless light/dark theme support
- ⚡ **Real-time Messaging** — Powered by Socket.io
- 🧾 **Form Validation** — Using Zod and React Hook Form
- 🧠 **State Management** — Redux Toolkit and React Query for data fetching
- 📱 **Responsive Design** — Built with Tailwind CSS and Shadcn UI

## 🧩 Tech Stack

### Frontend

- **React** (Vite + TypeScript)
- **React Router**
- **Redux Toolkit**
- **React Query**
- **React Hook Form** + **Zod**
- **Tailwind CSS** + **Shadcn UI**
- **Axios**
- **Socket.io (client)**
- **TypeScript**

### Backend

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Passport.js** (Local & Google OAuth)
- **Multer** for file uploads
- **Cloudinary** for media storage
- **Socket.io (server)**
- **TypeScript**
- **Zod** for schema validation

## 📁 Folder Structure

```
chat-app-mern/
 ├─ backend/
 │   └─ src/
 │       ├─ config/
 │       ├─ controllers/
 │       ├─ middlewares/
 │       ├─ models/
 │       ├─ routes/
 │       ├─ utils/
 │       └─ validators/
 │
 └─ frontend/
     └─ src/
         ├─ api/
         ├─ components/
         ├─ config/
         ├─ hooks/
         ├─ lib/
         ├─ pages/
         └─ slices/
```

## 🔧 Environment Variables

Create a `.env` file in `/backend` and add the following:

```
NODE_ENV=
MONGO_URI=
SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

BASE_URL=
```

## 💻 Installation & Setup

```sh
git clone https://github.com/lnirjar/chat-app-mern.git

cd chat-app-mern

# backend
cd backend
npm install

# Add your environment variables
# (see `.env` example above)

npm run dev

cd ..

# frontend
cd frontend
npm install
npm run dev
```

## 📦 Build

To create an optimized production build:

```sh
npm run build:production
npm start
```

## 🚀 Deployment

This project is deployed on Render.

## 🖼️ Screenshots

TODO: Screenshots here
