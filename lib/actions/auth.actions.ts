"use server";
import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * La función signUp registra un nuevo usuario en la base de datos de Firestore.
 * Primero verifica si el usuario ya existe mediante su UID. Si existe, retorna un mensaje de error.
 * Si no existe, crea un nuevo documento con el nombre y correo electrónico proporcionados.
 * Maneja errores específicos como correo ya registrado y errores generales durante el proceso de registro.
 */
export const signUp = async (params: SignUpParams) => {

  const { name, email, uid } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };

    await db.collection("users").doc(uid).set({
      name,
      email,
    })

    return {
      success: true,
      message: "Account created successfully. You can now sign in.",
    };
  } catch (error: any) {
    console.error("Error during sign up:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details,
    });

    if (error?.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email is already in use. Please try a different email.",
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred during sign up. Please try again later."
    }
  }
}


/**
 * La función signIn permite iniciar sesión a un usuario existente.
 * Recibe el correo electrónico y el idToken como parámetros.
 * Primero, verifica si el usuario existe en Firebase Authentication mediante su correo electrónico.
 * Si el usuario no existe, retorna un mensaje indicando que debe registrarse primero.
 * Si el usuario existe, llama a la función setSession para crear una cookie de sesión segura.
 * Maneja errores generales y retorna un mensaje apropiado en caso de fallo.
 */
export const signIn = async (params: SignInParams) => {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord)
      return {
        success: false,
        message: "User not found. Please sign up first.",
      };

    await setSession(idToken);
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "An unexpected error occurred during sign in. Please try again later."
    }
  }
}

/**  
 * Esta función crea una cookie de sesión segura utilizando un idToken proporcionado.
 * Utiliza Firebase Admin para generar una cookie de sesión válida por una semana (ONE_WEEK).
 * Luego, almacena esta cookie en el navegador del usuario con opciones de seguridad como httpOnly, secure y sameSite.
 */

export const setSession = async (idToken: string) => {
  const cookiesStore = await cookies();

  const sessionCookies = await auth.createSessionCookie(idToken, { expiresIn: ONE_WEEK * 1000 });

  cookiesStore.set(
    "session",
    sessionCookies,
    {
      maxAge: ONE_WEEK,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    }
  )
}

/**
 * La función getCurrentUser obtiene la información del usuario actualmente autenticado.
 * Primero, recupera la cookie de sesión almacenada en el navegador.
 * Si no existe la cookie de sesión, retorna null indicando que no hay usuario autenticado.
 * Si la cookie existe, verifica su validez utilizando Firebase Admin.
 * Luego, busca en la base de datos el documento del usuario correspondiente al UID decodificado.
 * Si el usuario existe en la base de datos, retorna sus datos junto con el id.
 * Si ocurre algún error o el usuario no existe, retorna null.
 */

export const getCurrentUser = async (): Promise<User | null> => {
  const cookiesStore = await cookies();
  const sessionCookie = cookiesStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

    if (!userRecord.exists) {
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id
    } as User;

  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * La función isAuthenticated verifica si hay un usuario autenticado actualmente.
 * Llama a la función getCurrentUser para obtener la información del usuario.
 * Retorna true si existe un usuario autenticado, o false en caso contrario.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

/**
 * La función signOut cierra la sesión del usuario actual.
 * Elimina la cookie de sesión del navegador y, opcionalmente, revoca la sesión en el servidor.
 * Retorna un mensaje indicando si el cierre de sesión fue exitoso o si ocurrió un error.
 */
export const signOut = async () => {
  const cookiesStore = await cookies();
  const sessionCookies = cookiesStore.get('session')?.value;

  if (!sessionCookies) return null;
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookies, true);
    await auth.revokeRefreshTokens(decodedClaims.uid);
    cookiesStore.delete('session');
    return {
      success: true,
      message: "Sign out successful. You can now sign in again."
    }
  } catch (error) {
    console.error("Error during sign out:", error);
    return {
      success: false,
      message: "An error occurred while signing out. Please try again later."
    }
  }
}