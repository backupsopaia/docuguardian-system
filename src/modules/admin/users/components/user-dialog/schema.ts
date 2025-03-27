
import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).optional(),
  role: z.enum(['admin', 'user']),
  department: z.string().min(1, { message: 'Departamento é obrigatório' }),
  isActive: z.boolean(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
