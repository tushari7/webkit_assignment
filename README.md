Webkit Assignment – Project & Task Management Tool

Overview
A simple internal tool that allows authenticated users to create projects, add tasks, and update task status (Todo / In Progress / Done).

Tech Stack
Frontend:
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Google OAuth

Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Features
- User registration & login (email/password)
- Google login support
- JWT-protected APIs
- Create and view projects
- Create tasks inside projects
- Update task status
- Clean and responsive UI

API (Short List)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/projects
- POST /api/projects
- GET /api/projects/:projectId
- GET /api/projects/:projectId/tasks
- POST /api/projects/:projectId/tasks
- PATCH /api/tasks/:taskId

Local Setup
Backend:
1. cd backend
2. npm install
3. npm run dev

Frontend:
1. cd frontend
2. npm install
3. npm run dev

Environment Variables
Backend (.env):
- MONGO_URI
- JWT_SECRET

Frontend (.env):
- VITE_API_URL

Demo Link: https://www.awesomescreenshot.com/video/48726738?key=49d00dc730635ae38ea745c5874a42a6
