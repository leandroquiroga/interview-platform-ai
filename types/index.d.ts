import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface SendVerificationCodeParams {
  name: string;
  email: string;
}

interface VerifyCodeParams {
  email: string;
  code: string;
  password: string;
}

interface VerificationCodeData {
  code: string;
  name: string;
  email: string;
  expiresAt: string;
  attempts: number;
  createdAt: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

type FormType = "sign-in" | "sign-up" | "change-password" | "verify-code";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

type FormFieldType = 'text' | 'email' | 'password' | 'file';

// Tipos específicos para cada formulario
interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
}

interface VerifyCodeFormData {
  code: string;
}

// Tipo union para todos los datos de formulario
type AuthFormData = SignInFormData | SignUpFormData | ChangePasswordFormData | VerifyCodeFormData;

interface BuildDynamicPromptParams {
  role: string;
  level: string;
  techstack: string;
  type: string;
  amount: number;
  language?: string;
  questionStyle?: string;
}

// Representa un par pregunta-respuesta generado por IA
interface QuestionAnswerPair {
  pregunta: string;
  respuesta: string;
}

// Representa una entrevista generada por IA, incluyendo campos adicionales como cover, ejemplos y respuestas
interface InterviewQuestionAI {
  role: string;
  level: string;
  techstack: string[];
  type: string;
  questions: QuestionAnswerPair[];
  userId: string;
  createdAt: string;
  cover: string;
  hasAnswerExamples: boolean;
  totalExamples: number;
}

interface ListItemsProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  href: string;
  label: string;
}
