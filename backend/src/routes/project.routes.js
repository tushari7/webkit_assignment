import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} from "../controllers/project.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:projectId", getProjectById);
router.delete("/:projectId", deleteProject);

export default router;