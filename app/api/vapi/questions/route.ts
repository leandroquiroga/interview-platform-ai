import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { buildDynamicPromptForQuestion } from "@/utils/functions";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

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
    // Generar las preguntas y respuestas con Gemini
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    console.log({ text });
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '-');
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
    };

    console.log(questionAnswerPairs);
    // Guardar en la colección 'interview_questions'
    await db.collection("interview_questions")
      .doc(normalizedRole)
      .collection("questions")
      .add(interviewData);

    return Response.json({ success: true, message: "Preguntas generadas y guardadas correctamente." }, { status: 200 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return Response.json(
      { success: false, message: "Ocurrió un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}