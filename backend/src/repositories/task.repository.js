import Task from "../models/task.model.js";

export const createTask = (data) => {
  return Task.create(data);
};

export const getTasksByProject = (projectId, userId) => {
  return Task.find({
    project: projectId,
    user: userId,
  }).sort({ createdAt: -1 });
};

export const updateTaskStatus = (taskId, userId, status) => {
  return Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    { status },
    { new: true }
  );
};

export const deleteTask = (taskId, userId) => {
  return Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });
};