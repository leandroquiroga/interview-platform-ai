import { z } from 'zod'

export const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3, 'Name is required') : z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  })
}

// Esta función construye un prompt dinámico para generar preguntas de entrevista de trabajo.
// Recibe un objeto con información sobre el rol, nivel, stack tecnológico, tipo de preguntas, cantidad, idioma y estilo de las preguntas.
// Devuelve un string que contiene instrucciones detalladas para generar preguntas personalizadas según los parámetros recibidos.

export const buildDynamicPrompt = ({
  role,
  level,
  techstack,
  type,
  amount,
  language = 'English',
  questionStyle = 'concise',
}: BuildDynamicPromptParams): string => {

  // Definir partes del prompt según condiciones
  const baseInstructions = `Prepare ${amount} questions for a job interview in ${language}.`;
  const roleInstruction = `The job role is ${role}.`;
  const levelInstruction = `The job experience level is ${level}.`;
  const techstackInstruction = techstack ? `The tech stack used in the job is: ${techstack}.` : '';
  const typeInstruction = `The focus between behavioral and technical questions should lean towards: ${type}.`

  // Ajustar el estilo de las preguntas
  const styleInstruction =
    questionStyle === 'detailed'
      ? 'Ensure the questions are detailed and include context for the candidate.'
      : 'Ensure the questions are concise and suitable for a voice assistant to read aloud.';
  // Formato de salida
  const outputInstruction = `Do NOT return the response like this: \`\`\`json\n["Question 1", "Question 2"]\n\`\`\` Instead, return ONLY: ["Question 1", "Question 2"]`;

  // Combinar todas las partes del prompt
  return [
    baseInstructions,
    roleInstruction,
    levelInstruction,
    techstackInstruction,
    typeInstruction,
    styleInstruction,
    outputInstruction,
  ]
    .filter(Boolean) // Eliminar instrucciones vacías (por ejemplo, si techstack está vacío)
    .join('\n');
}

export const buildDynamicPromptForQuestion = ({
  role,
  level,
  techstack,
  type,
  amount,
  language = "Español",
  questionStyle = "concise",
}: BuildDynamicPromptParams): string => {
  // Definir partes del prompt según condiciones
  const baseInstructions = `Genera ${amount} pares de preguntas y respuestas para una entrevista de trabajo en ${language}.`;
  const roleInstruction = `El rol del puesto es ${role}.`;
  const levelInstruction = `El nivel de experiencia requerido es ${level}.`;
  const techstackInstruction = techstack ? `Las tecnologías utilizadas en el puesto son: ${techstack}.` : "";
  const typeInstruction = `El enfoque de las preguntas debe ser principalmente ${type} (técnicas o conductuales).`;

  // Ajustar el estilo de las preguntas y respuestas
  const styleInstruction =
    questionStyle === "detailed"
      ? "Asegúrate de que las preguntas y respuestas sean detalladas e incluyan contexto para el candidato."
      : "Asegúrate de que las preguntas y respuestas sean concisas y adecuadas para ser leídas por un asistente de voz.";

  // Formato de salida
  const outputInstruction = `No devuelvas la respuesta envuelta en un bloque de código como: \`\`\`json\n[{"pregunta": "Pregunta 1", "respuesta": "Respuesta 1"}, {"pregunta": "Pregunta 2", "respuesta": "Respuesta 2"}]\n\`\`\` En su lugar, devuelve SOLAMENTE: [{"pregunta": "Pregunta 1", "respuesta": "Respuesta 1"}, {"pregunta": "Pregunta 2", "respuesta": "Respuesta 2"}]`;

  // Combinar todas las partes del prompt
  return [
    baseInstructions,
    roleInstruction,
    levelInstruction,
    techstackInstruction,
    typeInstruction,
    styleInstruction,
    outputInstruction,
  ]
    .filter(Boolean)
    .join("\n");
};