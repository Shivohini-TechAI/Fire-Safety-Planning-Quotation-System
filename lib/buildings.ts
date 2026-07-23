import api from "./api";

export interface Building {
  id: number;
  project_id: number;
  building_name: string;
  building_type: string;
  total_area: number | null;
  number_of_floors: number | null;
  risk_level: string | null;
}

export interface NewBuildingInput {
  project_id: number;
  building_name: string;
  building_type: string;
  total_area?: number;
  number_of_floors?: number;
  risk_level?: string;
}

// Backend has no "get by project" endpoint yet, so we fetch all and filter client-side.
export async function fetchBuildingsForProject(projectId: number): Promise<Building[]> {
  const res = await api.get("/buildings");
  return res.data.filter((b: Building) => b.project_id === projectId);
}

export async function createBuilding(input: NewBuildingInput): Promise<Building> {
  const res = await api.post("/buildings", input);
  return res.data.building;
}
