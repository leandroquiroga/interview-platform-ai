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
  if (typeof techstack !== 'string') {
    return Response.json(
      { success: false, message: 'Techstack must be a string.' },
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
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt
    })

    const interview = {
      role, type, level,
      techstack: techstack.split(','),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    }


    await db.collection('interviews').add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return Response.json({ success: false, message: 'An error occurred while processing your request.' }, { status: 500 });
  }
}