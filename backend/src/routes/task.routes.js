import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getTasksByProject,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

router.use(authMiddleware);

// Tasks under project
router.get("/projects/:projectId/tasks", getTasksByProject);
router.post("/projects/:projectId/tasks", createTask);

// Task actions
router.patch("/tasks/:taskId", updateTaskStatus);
router.delete("/tasks/:taskId", deleteTask);

export default router;