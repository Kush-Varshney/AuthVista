# 📝 AuthVista

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)](https://tailwindcss.com/)

> A modern full-stack notes management system with authentication, advanced search, categories, and clean architecture.

## 📋 Table of Contents

- **[🌟 Features](#-features)**
- **[🏗️ Architecture](#️-architecture)**
- **[📁 Project Structure](#-project-structure)**
- **[🚀 Quick Start](#-quick-start)**
- **[📚 API Documentation](#-api-documentation)**
- **[🚀 Deployment](#-deployment)**
- **[🔒 Security Features](#-security-features)**
- **[🧪 Testing](#-testing)**
- **[🐛 Troubleshooting](#-troubleshooting)**
- **[🤝 Contributing](#-contributing)**
- **[👤 Author](#-author)**
- **[📄 License](#-license)**

## 🌟 Features

### 🔐 Authentication & Security
- **JWT auth** with secure token storage
- **Protected API routes** via middleware
- **Password hashing** with bcrypt
- **Input validation** and CORS protection

### 📝 Notes & Categories
- **Note CRUD** with real-time updates
- **Categories** (personal, work, study, ideas, other)
- **Priority levels** (low, medium, high)
- **Custom tags** for better organization
- **Pin/Archive** functionality
- **Bulk operations** for multiple notes

### 🔍 Search & Filtering
- **Full-text search** across all note content
- **Multiple filters** by category, priority, tags
- **Date range** filtering
- **Sorting options** by date, priority, title

### 📈 Dashboard
- **Note statistics** and overview dashboard
- **Usage analytics** and insights
- **Visual charts** for data representation

### 🎨 UI/UX
- **Responsive** Tailwind CSS design
- **Modern components** and clean layout
- **Friendly loading and error states**

## 🏗️ Architecture

- **Frontend**: React.js + Next.js, TypeScript, Tailwind
- **Backend**: Express, Mongoose, JWT
- **Clean layers**: controllers → middlewares → models → routes

## 📁 Project Structure

```
AuthVista/
├── server/                        # Express API
│   ├── config/db.js              # Mongo connection
│   ├── controllers/              # Route handlers
│   ├── middlewares/              # Auth middleware
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # Express routers
│   └── server.js                 # App entry
│
├── client/                       # React app
│   └── src/
│       ├── components/           # UI & features
│       ├── contexts/             # React contexts
│       ├── pages/                # Page components
│       ├── utils/                # Helper functions
│       └── App.js                # Main component
│
├── app/                          # Next.js app (Additional)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # shadcn/ui components
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1) Clone and backend setup
```bash
git clone https://github.com/Kush-Varshney/AuthVista.git
cd AuthVista
cd  server
npm install
cp  .env  # create and edit
npm run dev
```

Backend .env example:
```env
MONGODB_URI=mongodb://localhost:27017/AuthVista
JWT_SECRET=your-secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 2) Frontend setup
```bash
cd client
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health: http://localhost:5000/api/health

## 📚 API Documentation

### Auth
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | - |
| GET | `/api/auth/me` | - |

### Notes
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/notes` | Supports pagination, filters, search |
| POST | `/api/notes` | `{ title, content, category, priority, tags }` |
| GET | `/api/notes/:id` | Get single note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/notes/search/query` | Search with query params |
| PATCH | `/api/notes/:id/pin` | Toggle pin status |
| PATCH | `/api/notes/:id/archive` | Toggle archive status |

### Users
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| DELETE | `/api/users/account` | Delete account |

All non-auth routes require `Authorization: Bearer <token>` header.

## 🚀 Deployment

- Frontend: Vercel or any Node host
- Backend: Railway/Render/Heroku
- Set environment variables accordingly

## 🔒 Security Features

- JWT auth, password hashing, protected routes
- CORS configured for local dev
- No secrets committed; use env files

## 🧪 Testing

- Add your preferred testing setup (Jest/RTL) for unit/integration

## 🐛 Troubleshooting

- If frontend cannot reach backend, verify `REACT_APP_API_URL` and backend port
- Ensure `token` exists in `localStorage` when calling protected routes
- Check backend logs for Mongo connection errors

## 🤝 Contributing

PRs welcome. Please follow conventional commits and keep PRs focused.

## 👤 Author

**Your Name**  
B.Tech CSE | Full Stack Developer  
[Portfolio](https://kushvarshney.vercel.app/) • [GitHub](https://github.com/Kush-Varshney) • [LinkedIn](https://www.linkedin.com/in/kush-varshney-490baa250/)

## 📄 License

Licensed under the **MIT License**.
