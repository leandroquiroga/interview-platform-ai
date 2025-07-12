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
