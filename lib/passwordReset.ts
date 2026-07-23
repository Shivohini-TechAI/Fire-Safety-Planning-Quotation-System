import api from "./api";

export async function requestPasswordReset(email: string) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await api.post("/auth/reset-password", { token, newPassword });
  return res.data;
}