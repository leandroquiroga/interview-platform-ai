import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  return Response.json({ success: true, message: 'Vapi SDK is ready to use' }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

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

  try {
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Prepare a question for job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      The focus between behavioral and technical questions should lean towards: ${type}.
      The amount of question to generate is: ${amount}.
      Please return only the question, without any additional text or formatting.
      The question are going to be read by a voice assistant, so do not use "/" or "*" and avoid any special characters which might break the reading.
      Return the question formatted like this: ["Question 1", "Question 2", "Question 3"]
      Thank you! <3
      `,
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