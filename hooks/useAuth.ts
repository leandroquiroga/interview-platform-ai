import { auth } from "@/firebase/client";
import { signIn, signOut, signUp } from "@/utils/functions/auth.action";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Custom hook para manejar la autenticación de usuarios.
 * Permite registrar nuevos usuarios ("sign-up") o iniciar sesión ("sign-in")
 * Permite manejar el cierre de sesión ("sign-out") de manera sencilla,
 * utilizando Firebase Authentication y funciones auxiliares personalizadas.
 * 
 * - En "sign-up": crea el usuario en Firebase, luego lo registra en la base de datos propia.
 * - En "sign-in": autentica el usuario y obtiene el token de sesión.
 * - En "sign-out": cierra la sesión del usuario y lo desautentica.
 * 
 * Muestra notificaciones de éxito o error usando la librería "sonner"
 * y redirige al usuario según el resultado de la operación.
 */

export const useAuth = (type: FormType) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAuth = async (data: FormData) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;
        setIsLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Sign up successful");
        router.push("/sign-in");
        setIsLoading(false);
        return;
      }

      const { email, password } = data;
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
    } catch (error) {
      setIsLoading(false);
      console.log("Error during authentication:", error);
      toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
