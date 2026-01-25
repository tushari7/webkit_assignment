import * as projectRepo from "../repositories/project.repository.js";

/* Create project */
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Project name is required");
    }

    const project = await projectRepo.createProject({
      name,
      description,
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

/* Get all projects of logged-in user */
export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectRepo.getProjectsByUser(req.user._id);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

/* Get single project */
export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectRepo.getProjectByIdAndUser(
      req.params.projectId,
      req.user._id
    );

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

/* Delete project */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await projectRepo.deleteProjectByIdAndUser(
      req.params.projectId,
      req.user._id
    );

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};