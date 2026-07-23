import quotationApi from "./quotationApi";

export interface Equipment {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

interface EquipmentResponse {
  success: boolean;
  data: Equipment[];
}

export async function fetchEquipment(): Promise<Equipment[]> {
  const res = await quotationApi.get<EquipmentResponse>("/equipment");
  return res.data.data;
}