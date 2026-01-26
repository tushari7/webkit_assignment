import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoutes from "./routes/ProtectedRoutes"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetails"
import { Toaster } from "sonner"


function App() {
  return (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoutes />} >
          <Route index element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
