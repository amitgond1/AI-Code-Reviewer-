# AI Code Reviewer SaaS (Full Stack)

Production-style full stack AI Code Reviewer platform with:

- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose
- FastAPI AI service
- Monaco editor, Recharts analytics, JWT auth, file upload, GitHub integration, PDF export, notifications, AI chat assistant

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
```

## Features Included

1. Authentication
- Signup, Login, Logout
- JWT (remember me short/long expiry)
- Password hashing (bcrypt)
- Forgot password + reset password flow
- Protected routes and session expiry handling

2. Landing Page
- Hero, Features, Screenshots, Tech Stack, Testimonials, Footer
- Smooth animations with Framer Motion

3. Dashboard UX
- Sidebar + sticky top bar
- Avatar + notifications dropdown
- Mobile responsive hamburger menu

4. Code Review Workspace
- Monaco editor with syntax highlighting/line numbers/auto-indent
- Dark/light mode
- Supported languages: C++, Python, JavaScript, Java, C
- Upload file / paste code / GitHub repo input
- Lines of code and language detection

5. AI Review Engine
- Backend sends code to FastAPI `/analyze`
- JSON output with:
  - bugs
  - improvements
  - time_complexity
  - space_complexity
  - better_code
  - score
  - code_smells
  - security_warnings
  - duplicate_code
  - performance_suggestions
  - naming_suggestions

6. Review Output
- Score card with circular visualization
- Complexity charts
- Review cards
- Export review PDF

7. History + Analytics
- Review history list and detail page
- Analytics dashboard (reviews/day, languages, avg/best/worst scores)

8. Profile + Settings
- Edit profile and upload avatar
- Theme toggle
- Change password
- Delete account

9. Notifications
- Review completed notifications
- Fetch + mark as read

10. AI Chat Assistant
- Ask questions about your code with `/chat`

## Backend API

### Auth Routes
- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/forgot-password`
- `POST /api/reset-password`
- `POST /api/reset-password/:token`

### Review Routes
- `POST /api/review`
- `POST /api/review/github`
- `GET /api/reviews`
- `GET /api/review/:id`
- `DELETE /api/review/:id`
- `GET /api/review/:id/export`

### User Routes
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/change-password`
- `DELETE /api/account`

### Other
- `GET /api/analytics`
- `GET /api/notifications`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/chat`

## AI Server API

- `POST /analyze`
  - input: `code`, `language`
  - output: review JSON
- `POST /chat`
  - input: `question`, `code`, `language`
  - output: assistant answer
- `GET /health`

## Installation Steps

## 1) Clone / open project

```bash
cd "AI resume"
```

## 2) Setup Backend

```bash
cd backend
npm install
copy .env.example .env
```

Update `backend/.env` with your values:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `AI_SERVICE_URL`
- optional: SMTP + GitHub token

Run backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## 3) Setup AI Server

```bash
cd ../ai-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Optional: set `OPENAI_API_KEY` in `ai-server/.env`.

Run AI server:

```bash
uvicorn main:app --reload --port 8000
```

AI server runs on `http://localhost:8000`.

## 4) Setup Frontend

```bash
cd ../frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## MongoDB Setup

Use local MongoDB:

```bash
mongod
```

or MongoDB Atlas URI in `backend/.env`.

## Environment Variables Summary

### backend/.env
- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN_SHORT`
- `JWT_EXPIRES_IN_LONG`
- `CLIENT_URL`
- `AI_SERVICE_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` (optional)
- `GITHUB_TOKEN`, `GITHUB_DEFAULT_BRANCH` (optional)

### frontend/.env
- `VITE_API_URL` (default `http://localhost:5000/api`)

### ai-server/.env
- `BACKEND_ORIGIN`
- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL`

## Notes

- If no OpenAI key is set, AI server uses built-in heuristic analysis fallback so the app still works.
- Forgot-password email uses SMTP if configured; otherwise reset URL/token is logged/returned in dev mode.
- GitHub integration supports public repos and common code extensions.
