'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import { signIn, signOut } from "@/lib/actions/auth.actions";
import { AuthFormData, FormType } from "@/types";

/**
 * Custom hook para manejar la autenticación de usuarios.
 * Permite registrar nuevos usuarios ("sign-up") o iniciar sesión ("sign-in")
 * Permite manejar el cierre de sesión ("sign-out") de manera sencilla,
 * utilizando Firebase Authentication y funciones auxiliares personalizadas.
 * 
 * - En "sign-up": crea el usuario en Firebase, luego lo registra en la base de datos propia.
 * - En "sign-in": autentica el usuario y obtiene el token de sesión.
 * - En "sign-out": cierra la sesión del usuario y lo desautentica.
 * - En "change-password": permite al usuario cambiar su contraseña actual.
 * - En "verify-code": verifica el código de verificación enviado al email del usuario.
 * 
 * Muestra notificaciones de éxito o error usando la librería "sonner"
 * y redirige al usuario según el resultado de la operación.
 */

export const useAuth = (type: FormType) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAuth = async (data: AuthFormData) => {
    try {
      if (type === "sign-up") {
        const { name, email } = data as { name: string; email: string };
        setIsLoading(true);

        try {
          // Enviar código de verificación
          const response = await fetch('/api/auth/send-verification-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          });

          const result = await response.json();

          if (!result.success) {
            toast.error(result.message);
            setIsLoading(false);
            return;
          }

          // Guardar datos temporalmente para el siguiente paso
          sessionStorage.setItem('signup-data', JSON.stringify(data));

          toast.success("Verification code sent to your email");
          router.push("/verify-code");
          setIsLoading(false);
          return;

        } catch (error) {
          console.error('Error sending verification code:', error);
          toast.error('Failed to send verification code. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      if (type === "verify-code") {
        const { code } = data as { code: string };
        setIsLoading(true);

        try {
          // Obtener datos del signup desde sessionStorage
          const signupDataStr = sessionStorage.getItem('signup-data');
          if (!signupDataStr) {
            toast.error("Session expired. Please start the registration process again.");
            router.push("/sign-up");
            setIsLoading(false);
            return;
          }

          const signupData = JSON.parse(signupDataStr);
          const { email, password } = signupData;

          // Verificar código
          const response = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code, password }),
          });

          const result = await response.json();

          if (!result.success) {
            toast.error(result.message);
            setIsLoading(false);
            return;
          }

          // Limpiar datos temporales
          sessionStorage.removeItem('signup-data');

          toast.success("Account verified successfully! Please sign in.");
          router.push("/sign-in");
          setIsLoading(false);
          return;

        } catch (error) {
          console.error('Error verifying code:', error);
          toast.error('Failed to verify code. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      if (type === "sign-in") {
        const { email, password } = data as { email: string; password: string };

        if (!email || !password) {
          toast.error("Email and password are required");
          return;
        }

        setIsLoading(true);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to retrieve user token. Please try again.");
          return;
        }

        await signIn({ email, idToken });

        toast.success("Sign in successful");
        router.push("/");
        setIsLoading(false);
        return;
      }

      if (type === "change-password") {
        const { newPassword, oldPassword } = data as { newPassword: string; oldPassword: string };

        // Validar que las contraseñas no estén vacías
        if (!newPassword || !oldPassword) {
          toast.error("Both current and new passwords are required");
          return;
        }

        // Validar requisitos de la nueva contraseña (por ejemplo, longitud mínima)
        if (newPassword.length < 6) {
          toast.error("New password must be at least 6 characters long");
          return;
        }

        setIsLoading(true);

        // Verificar que el usuario esté autenticado
        const user = auth.currentUser;
        if (!user) {
          toast.error("You must be logged in to change your password");
          setIsLoading(false);
          return;
        }

        // Reautenticar al usuario con la contraseña actual
        const credential = EmailAuthProvider.credential(user.email!, oldPassword);
        await reauthenticateWithCredential(user, credential);

        // Actualizar la contraseña en Firebase Authentication
        await updatePassword(user, newPassword);

        // Si llegamos aquí, la contraseña se actualizó correctamente
        toast.success("Password changed successfully");
        router.push("/profile");
        setIsLoading(false);
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null) {
        const typedError = error as { code?: string; message?: string };
        if (typedError.code === "auth/wrong-password") {
          toast.error("Current password is incorrect");
        } else if (typedError.code === "auth/weak-password") {
          toast.error("New password is too weak");
        } else {
          toast.error(`An error occurred: ${typedError.message || "Unknown error"}`);
        }
      } else {
        toast.error("An unknown error occurred");
      }
      setIsLoading(false);
      console.log("Error during authentication:", error);
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
      await signOut();
      toast.success("Sign out successful");
      router.push("/sign-in");
      setIsLoading(false);
      return;
    } catch (error) {
      setIsLoading(false);
      console.log("Error during sign out:", error);
      toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { handleAuth, handleSignOut, isLoading }
}
