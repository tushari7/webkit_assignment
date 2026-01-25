import Project from "../models/project.model.js";
import * as taskRepo from "../repositories/task.repository.js";

/* Get tasks by project */
export const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const tasks = await taskRepo.getTasksByProject(
      projectId,
      req.user._id
    );

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/* Create task */
export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { projectId } = req.params;

    if (!title) {
      res.status(400);
      throw new Error("Task title is required");
    }

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const task = await taskRepo.createTask({
      title,
      description,
      project: projectId,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

/* Update task status */
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { taskId } = req.params;

    if (!["Todo", "In Progress", "Done"].includes(status)) {
      res.status(400);
      throw new Error("Invalid task status");
    }

    const task = await taskRepo.updateTaskStatus(
      taskId,
      req.user._id,
      status
    );

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

/* Delete task (optional but recommended) */
export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await taskRepo.deleteTask(
      taskId,
      req.user._id
    );

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};