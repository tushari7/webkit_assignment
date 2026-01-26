import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

export default router;