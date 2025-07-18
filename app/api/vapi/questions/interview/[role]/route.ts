import { db } from "@/firebase/admin";

export async function GET(request: Request, { params }: { params: { role: string } }) {
  const { role } = params;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Validar que el rol sea uno de los permitidos
  const validRoles = ["frontend", "backend", "fullstack", "devops", "ai_engineer", "mobile_developer"];
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  if (!validRoles.includes(normalizedRole)) {
    return Response.json(
      { success: false, message: `El rol debe ser uno de: ${validRoles.join(", ")}.` },
      { status: 400 }
    );
  }

  // Validar que userId esté presente
  if (!userId) {
    return Response.json(
      { success: false, message: "El userId es obligatorio." },
      { status: 400 }
    );
  }

  try {
    // Consultar los documentos en la subcolección 'interviews' del rol, filtrando por userId
    const snapshot = await db
      .collection("interview_questions")
      .doc(normalizedRole)
      .collection("questions")
      .where("userId", "==", userId)
      .where("hasAnswerExamples", "==", true)
      .get();

    // Mapear los documentos a un formato útil
    const interviews = snapshot.docs.map((doc) => ({
      interviewId: doc.id,
      role: normalizedRole,
      seniority: doc.data().seniority,
      technologies: doc.data().technologies,
      questionType: doc.data().questionType,
      questions: doc.data().questions,
      createdAt: doc.data().createdAt,
    }));

    return Response.json({
      success: true,
      data: interviews,
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las entrevistas:", error);
    return Response.json(
      { success: false, message: "Ocurrió un error al obtener las entrevistas." },
      { status: 500 }
    );
  }
}