import { db, auth } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { buildDynamicPromptForQuestion } from "@/utils/functions";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Obtener el userId desde los headers
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({
        success: false,
        message: "No autorizado. Falta el userId del usuario autenticado."
      }, { status: 401 });
    }

    // Consultar el documento del usuario
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return Response.json({
        success: false,
        message: "Usuario no encontrado."
      }, { status: 404 });
    }

    const userData = userDoc.data();
    const questions = userData?.questions || [];

    return Response.json({
      success: true,
      data: questions,
    }, { status: 200 });
  } catch (error) {
    console.error("Error en la solicitud GET:", error);
    return Response.json(
      { success: false, message: "Ocurrió un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  // 1. Obtener la cookie de sesión
  const cookiesStore = await cookies();
  const sessionCookie = cookiesStore.get('session')?.value;

  console.log("=== POST /api/vapi/questions ===");
  console.log("Session cookie exists:", !!sessionCookie);
  console.log("Session cookie length:", sessionCookie?.length || 0);

  if (!sessionCookie) {
    console.log("❌ No session cookie found");
    return Response.json(
      {
        success: false,
        message: 'No se proporcionó una sesión válida. Asegúrate de haber iniciado sesión.',
      },
      { status: 401 }
    );
  }

  // 2. Verificar la cookie y obtener el userId
  let userid: string;
  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    userid = decodedToken.uid; // El userId del usuario autenticado
  } catch (error) {
    console.error("❌ Error verificando sesión:", error);
    return Response.json(
      { success: false, message: 'Sesión inválida o expirada. Por favor, inicia sesión nuevamente.' },
      { status: 401 }
    );
  }

  const { role, level, techstack, type, amount, language } = await request.json();

  // Validar los datos de entrada
  if (!role || !level || !techstack || !type || !amount || !userid) {
    return Response.json(
      { success: false, message: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  // Validar que amount sea un número positivo
  const count = parseInt(amount, 10);
  if (isNaN(count) || count <= 0) {
    return Response.json(
      { success: false, message: "La cantidad de preguntas debe ser un número positivo." },
      { status: 400 }
    );
  }

  // Validar que technologies sea una cadena
  if (typeof techstack !== "string") {
    return Response.json(
      { success: false, message: "Las tecnologías deben ser una cadena de texto." },
      { status: 400 }
    );
  }

  // Validar que el rol sea uno de los permitidos
  const validRoles = ["frontend", "backend", "fullstack", "devops", "ai_engineer", "mobile_developer"];
  const normalizedRole = role.toLowerCase().split("-")[0]
  console.log({ normalizedRole });
  if (!validRoles.includes(normalizedRole)) {
    return Response.json(
      { success: false, message: `El rol debe ser uno de: ${validRoles.join(", ")}.` },
      { status: 400 }
    );
  }

  // Construir el prompt dinámico
  const prompt = buildDynamicPromptForQuestion({
    role,
    level,
    techstack,
    type,
    amount,
    language: language || "Español",
  });

  try {
    // Verificar el límite de ejemplos generados por usuario 
    const userRef = db.collection("users").doc(userid);
    const userDoc = await userRef.get();

    let totalExamples = 0;
    if (userDoc.exists) {
      const userLimits = userDoc.data()?.totalExamples || {};
      totalExamples = userLimits.totalExamples || 0;
    }

    const MAX_EXAMPLES = parseInt(process.env.NEXT_PUBLIC_MAX_EXAMPLES_PER_USER || "0", 10);

    if (totalExamples >= MAX_EXAMPLES) {
      return Response.json(
        { success: false, message: `Has alcanzado el límite máximo de ${MAX_EXAMPLES} ejemplos generados.` },
        { status: 400 }
      );
    }

    // Generar las preguntas y respuestas con Gemini
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    // Parsear la respuesta como un arreglo de objetos con preguntas y respuestas
    const questionAnswerPairs = JSON.parse(text);

    // Preparar los datos para Firestore
    const interviewData = {
      role: normalizedRole,
      level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()),
      type,
      questions: questionAnswerPairs,
      userId: userid,
      createdAt: new Date().toISOString(),
      cover: getRandomInterviewCover(),
      hasAnswerExamples: true,
      totalExamples: totalExamples + 1,
    };

    // Obtener el documento actual del usuario
    const currentQuestionsExamples = userDoc.exists ? (userDoc.data()?.questions || []) : [];
    // Agregar la nueva entrevista al arreglo de interviews
    const updatedInterviews = [...currentQuestionsExamples, interviewData];
    // Actualizar el total de ejemplos generados por el usuario
    await userRef.set({
      questions: updatedInterviews
    }, { merge: true });

    return Response.json({ success: true, message: "Preguntas generadas y guardadas correctamente." }, { status: 200 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return Response.json(
      { success: false, message: "Ocurrió un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}