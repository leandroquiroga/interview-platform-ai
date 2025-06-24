import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/utils/functions/auth.action";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  name?: string;
  email: string;
  password: string;
}

/**
 * Custom hook para manejar la autenticación de usuarios.
 * Permite registrar nuevos usuarios ("sign-up") o iniciar sesión ("sign-in")
 * utilizando Firebase Authentication y funciones auxiliares personalizadas.
 * 
 * - En "sign-up": crea el usuario en Firebase, luego lo registra en la base de datos propia.
 * - En "sign-in": autentica el usuario y obtiene el token de sesión.
 * 
 * Muestra notificaciones de éxito o error usando la librería "sonner"
 * y redirige al usuario según el resultado de la operación.
 */

export const useAuth = (type: FormType) => {
  const router = useRouter();

  const handleAuth = async (data: FormData) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

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
        return;
      }

      const { email, password } = data;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();

      if (!idToken) {
        toast.error("Failed to retrieve user token. Please try again.");
        return;
      }

      await signIn({ email, idToken });

      toast.success("Sign in successful");
      router.push("/");
      return;
    } catch (error) {
      console.log("Error during authentication:", error);
      toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  return { handleAuth }
}
