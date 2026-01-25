export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type Project = {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project_id: string;
  created_at: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  status: TaskStatus;
}