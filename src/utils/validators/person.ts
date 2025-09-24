import { z } from 'zod';
import { isValidDDMMYYYY } from '@/utils/date';

export const personCreateSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Informe o nome completo' })
    .trim()
    .min(3, 'Nome muito curto'),
  birthDate: z
    .string()
    .trim()
    .optional()
    .refine((s) => isValidDDMMYYYY(s), { message: 'Use DD/MM/AAAA válido' }),
  notes: z.string().trim().max(500, 'Máximo de 500 caracteres').optional(),
});

export type PersonCreateSchema = z.infer<typeof personCreateSchema>;
