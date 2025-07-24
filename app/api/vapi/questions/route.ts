import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { buildDynamicPromptForQuestion } from "@/utils/functions";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET(request: Request) {

  try {
    // Obtener el userId desde los headers (ajusta según tu autenticación)
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: "No autorizado. Falta el userId del usuario autenticado."
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // Consultar el documento del usuario
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return new Response(JSON.stringify({
        success: false,
        message: "Usuario no encontrado."
      }), { status: 404, headers: { "Content-Type": "application/json" } });
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
  const { role, level, techstack, type, amount, userid, language } = await request.json();

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
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
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