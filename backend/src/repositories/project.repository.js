import Project from "../models/project.model.js";

export const createProject = (data) => {
  return Project.create(data);
};

export const getProjectsByUser = (userId) => {
  return Project.find({ user: userId }).sort({ createdAt: -1 });
};

export const getProjectByIdAndUser = (projectId, userId) => {
  return Project.findOne({ _id: projectId, user: userId });
};

export const deleteProjectByIdAndUser = (projectId, userId) => {
  return Project.findOneAndDelete({ _id: projectId, user: userId });
};