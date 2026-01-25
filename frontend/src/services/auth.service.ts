import api from "../lib/api";

export type User = {
  id: string;
  email: string;
  name?: string;
};

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
};