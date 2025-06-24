import { useForm } from "react-hook-form";
import { authFormSchema } from "@/utils/functions"
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Custom hook para manejar formularios de autenticación.
 * Utiliza react-hook-form junto con validación usando Zod.
 * 
 * @param type Tipo de formulario de autenticación (por ejemplo, login o registro).
 * @returns Métodos y estados del formulario proporcionados por useForm.
 */



export const useAuthForm = (type: FormType) => {
  const formSchema = authFormSchema(type);
  const form = useForm<AuthFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  return form;
}