import api from "./api";

export interface Project {
  id: number;
  project_name: string;
  client_name: string;
  building_name: string;
  location: string | null;
  description: string | null;
  status: string | null;
  user_id: number;
  created_at: string;
}

export interface NewProjectInput {
  project_name: string;
  client_name: string;
  building_name: string;
  location?: string;
  description?: string;
  status?: string;
  user_id: number;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get("/projects");
  return res.data;
}

export async function createProject(input: NewProjectInput): Promise<Project> {
  const res = await api.post("/projects", input);
  return res.data.project;
}
