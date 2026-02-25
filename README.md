# AI Code Reviewer SaaS

Production-level full stack AI Code Reviewer web app with React, Express, MongoDB, and FastAPI.

## Screenshots

> Add your screenshot files in `docs/screenshots/` with the exact names below.

### Landing Page

![Landing Page](docs/screenshots/landing-page.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Review Code Workspace

![Review Code](docs/screenshots/review-code.png)

### Review History

![Review History](docs/screenshots/review-history.png)

### Analytics

![Analytics](docs/screenshots/analytics.png)

## Features

### Authentication & Security
- User signup, login, logout
- JWT authentication with remember-me support
- Password hashing with bcrypt
- Forgot/reset password flow
- Protected routes and session expiry handling

### AI Code Review
- Paste code, upload files, or review from GitHub repo URL
- Language support: C++, C, Python, JavaScript, Java
- AI analysis for:
  - bugs
  - improvements
  - time complexity
  - space complexity
  - code smells
  - security warnings
  - duplicate code hints
  - performance suggestions
  - naming suggestions
- Code quality score (0-100)
- Better-code suggestion block
- In-page AI chat assistant

### Dashboard & Insights
- SaaS-style dashboard layout with sidebar/topbar
- Review history and detailed review result pages
- Analytics with Recharts:
  - reviews per day
  - language usage
  - average/best/worst score
- Notification center with read/unread state

### User Experience
- Monaco editor integration
- Dark/light mode toggle
- Responsive mobile/tablet/desktop layout
- Framer Motion animations
- PDF export for review reports
- Profile update + avatar upload
- Settings: password change and account deletion

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Monaco Editor (`@monaco-editor/react`)
- Recharts
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs
- Multer
- Nodemailer
- PDFKit

### AI Service
- Python
- FastAPI
- Uvicorn
- OpenAI SDK (optional, with fallback heuristic analyzer)

## Project Structure

```text
frontend/
  src/
    components/
    pages/
    hooks/
    utils/
    styles/
backend/
  controllers/
  routes/
  middleware/
  models/
  config/
ai-server/
  main.py
  requirements.txt
docs/
  screenshots/
```

## API Overview

### Auth
- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/forgot-password`
- `POST /api/reset-password`
- `POST /api/reset-password/:token`

### Reviews
- `POST /api/review`
- `POST /api/review/github`
- `GET /api/reviews`
- `GET /api/review/:id`
- `DELETE /api/review/:id`
- `GET /api/review/:id/export`

### User
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/change-password`
- `DELETE /api/account`

### Analytics / Notifications / Chat
- `GET /api/analytics`
- `GET /api/notifications`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/chat`

### AI Server
- `POST /analyze`
- `POST /chat`
- `GET /health`

## Setup

### 1) Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### 2) AI Server
```bash
cd ../ai-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

### 3) Frontend
```bash
cd ../frontend
npm install
copy .env.example .env
npm run dev
```

## Environment Variables

### `backend/.env`
- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN_SHORT`
- `JWT_EXPIRES_IN_LONG`
- `CLIENT_URL`
- `AI_SERVICE_URL`
- SMTP vars (optional)
- GitHub token vars (optional)

### `frontend/.env`
- `VITE_API_URL`

### `ai-server/.env`
- `BACKEND_ORIGIN`
- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL`

## Notes
- If `OPENAI_API_KEY` is not configured, the AI service uses fallback heuristic analysis.
- In development, forgot-password can return a dev token when SMTP is not configured.
