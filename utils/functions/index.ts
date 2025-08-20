import { z } from 'zod'
import {
  User, Contact2, Blocks,
  Shield,
  Crown,
  Trophy,
} from 'lucide-react';

import { BuildDynamicPromptParams, FormType } from '@/types';

// Esquemas de validación individuales AuthForm
export const signUpSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters long'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});

export const verifyCodeSchema = z.object({
  code: z.string().min(6, 'Verification code is required').max(6, 'Verification code must be 6 digits long'),
});

// Form validation schemaes ComboBoxForm
export const InterviewFormSchema = z.object({
  seniority: z.string({
    required_error: 'Please select a seniority level.',
  }),
  rolePosition: z.string({
    required_error: 'Please select a position.',
  }),
  technologies: z
    .array(z.string())
    .min(1, {
      message: 'You must select at least one technology.',
    })
    .max(4, {
      message: 'You can select up to 4 technologies maximum.',
    }),
  questionAmount: z
    .number({
      required_error: 'Please select the number of questions.',
    })
    .min(1, {
      message: 'Number of questions must be at least 1.',
    })
    .max(5, {
      message: 'Number of questions must be maximum 5.',
    }),
});
// Función para obtener el esquema según el tipo
export const authFormSchema = (type: FormType) => {
  switch (type) {
    case 'sign-up':
      return signUpSchema;
    case 'sign-in':
      return signInSchema;
    case 'change-password':
      return changePasswordSchema;
    case 'verify-code':
      return verifyCodeSchema;
    default:
      return signInSchema;
  }
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
  language,
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

export const items = [
  { name: 'Profile', link: '/profile', icon: User },
  { name: 'Interview Practice', link: '/interview-practice', icon: Blocks },
  {
    name: 'Interview',
    link: '/interview',
    icon: Contact2,
  },
];

// Generar avatar aleatorio usando la primera letra del nombre y email como seed
export const getAvatarUrl = (name: string | undefined, email: string) => {
  const nameChar = name?.charAt(0).toLowerCase() || 'u';
  const seed = nameChar + email.length.toString();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=3b82f6&textColor=ffffff`;
};

export const getUserInitials = (name: string | undefined) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getMembershipBadge = (interviewCount: number) => {
  if (interviewCount >= 50) {
    return { label: 'Experto', variant: 'default' as const, icon: Crown };
  } else if (interviewCount >= 20) {
    return { label: 'Avanzado', variant: 'secondary' as const, icon: Trophy };
  } else if (interviewCount >= 5) {
    return { label: 'Intermedio', variant: 'outline' as const, icon: Shield };
  }
  return { label: 'Principiante', variant: 'outline' as const, icon: User };
};

// Application data configuration
export const TECHNOLOGIES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'React', value: 'react' },
  { label: 'Next.js', value: 'next.js' },
  { label: 'Node.js', value: 'node.js' },
  { label: 'Express.js', value: 'express.js' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'Git', value: 'git' },
] as const;

export const SENIORITY_LEVELS = [
  { label: 'Junior', value: 'junior' },
  { label: 'Semi Senior', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead', value: 'lead' },
  { label: 'Expert', value: 'expert' },
] as const;

export const ROLE_POSITIONS = [
  { label: 'Frontend Developer', value: 'frontend-developer' },
  { label: 'Backend Developer', value: 'backend-developer' },
  { label: 'Fullstack Developer', value: 'fullstack-developer' },
  { label: 'Mobile Developer', value: 'mobile-developer' },
] as const;

export const QUESTION_AMOUNTS = [
  { label: '1 question', value: 1 },
  { label: '2 questions', value: 2 },
  { label: '3 questions', value: 3 },
  { label: '4 questions', value: 4 },
  { label: '5 questions', value: 5 },
] as const;

