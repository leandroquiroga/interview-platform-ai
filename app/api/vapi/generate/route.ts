import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { buildDynamicPrompt } from "@/utils/functions";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  return Response.json({ success: true, message: 'Vapi SDK is ready to use' }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid, language, questionStyle } = await request.json();

  // Validar los datos de entrada
  if (!type || !role || !level || !techstack || !amount || !userid) {
    return Response.json(
      { success: false, message: 'All fields are required.' },
      { status: 400 }
    );
  }

  // Validar que amount sea un número positivo
  const questionAmount = parseInt(amount, 10);
  if (isNaN(questionAmount) || questionAmount <= 0) {
    return Response.json(
      { success: false, message: 'Amount must be a positive number.' },
      { status: 400 }
    );
  }

  // Validar que techstack sea una cadena
  if (
    !(
      (typeof techstack === 'string' && techstack.trim().length > 0) ||
      (Array.isArray(techstack) && techstack.every(item => typeof item === 'string' && item.trim().length > 0))
    )
  ) {
    return Response.json(
      { success: false, message: 'Techstack must be a non-empty string or an array of non-empty strings.' },
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

  const validRoles = ["frontend", "backend", "fullstack", "devops", "ai_engineer", "mobile_developer"];
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  if (!validRoles.includes(normalizedRole)) {
    return Response.json(
      { success: false, message: `El rol debe ser uno de: ${validRoles.join(", ")}.` },
      { status: 400 }
    );
  }
  const prompt = buildDynamicPrompt({
    role,
    level,
    techstack,
    type,
    amount,
    language,
    questionStyle,
  });

  try {
    const userRef = db.collection("users").doc(userid);
    const userDoc = await userRef.get();

    let totalInterview = 0;
    if (userDoc.exists) {
      const userLimits = userDoc.data()?.totalInterview || {};
      totalInterview = userLimits.totalInterview || 0;
    }
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt
    })

    const techstacks = Array.isArray(techstack)
      ? techstack.map(item => item.trim())
      : techstack.split(',').map(item => item.trim());


    const interview = {
      role,
      type,
      level,
      techstack: techstacks,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      totalInterview: totalInterview + 1,
    }

    // Obtener el documento actual del usuario
    const currentInterviews = userDoc.exists ? (userDoc.data()?.interviews || []) : [];

    // Agregar la nueva entrevista al arreglo de interviews
    const updatedInterviews = [...currentInterviews, interview];

    // Actualizar el documento del usuario con el nuevo arreglo de interviews y el total
    await userRef.set(
      {
        interviews: updatedInterviews,
      },
      { merge: true }
    );

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return Response.json({ success: false, message: 'An error occurred while processing your request.' }, { status: 500 });
  }
}