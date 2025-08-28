"use client";
import { useForm } from "react-hook-form";
import {
  signInSchema,
  signUpSchema,
  changePasswordSchema,
  verifyCodeSchema
} from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormType } from "@/types";

/**
 * Custom hook para manejar formularios de autenticación.
 * Utiliza react-hook-form junto con validación usando Zod.
 */
export function useAuthForm(type: FormType) {
  switch (type) {
    case 'sign-in':
      return useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
      });

    case 'sign-up':
      return useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: '', email: '', password: '' },
      });

    case 'change-password':
      return useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { oldPassword: '', newPassword: '' },
      });

    case 'verify-code':
      return useForm({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues: { code: '' },
      });

    default:
      return useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
      });
  }
}