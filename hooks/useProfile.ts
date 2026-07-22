import { useMutation } from "@tanstack/react-query";
import { updateProfile, changePassword, UpdateProfileInput, ChangePasswordInput } from "@/lib/profile";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
  });
}