import api from "./api";

export interface UpdateProfileInput {
  full_name?: string;
  email?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function updateProfile(input: UpdateProfileInput) {
  const res = await api.put("/auth/profile", input);
  return res.data;
}

export async function changePassword(input: ChangePasswordInput) {
  const res = await api.put("/auth/change-password", input);
  return res.data;
}