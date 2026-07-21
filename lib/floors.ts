import api from "./api";

export interface Floor {
  id: number;
  building_id: number;
  floor_name: string;
  floor_number: number | null;
  area: number | null;
  occupancy_type: string | null;
}

export interface NewFloorInput {
  building_id: number;
  floor_name: string;
  floor_number?: number;
  area?: number;
  occupancy_type?: string;
}

// Backend has no "get by building" endpoint yet, so we fetch all and filter client-side.
export async function fetchFloorsForBuilding(buildingId: number): Promise<Floor[]> {
  const res = await api.get("/floors");
  return res.data.filter((f: Floor) => f.building_id === buildingId);
}

export async function createFloor(input: NewFloorInput): Promise<Floor> {
  const res = await api.post("/floors", input);
  return res.data.floor;
}
