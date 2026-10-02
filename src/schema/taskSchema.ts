//taskSchema.ts

import { title } from 'node:process';
import z from 'zod';

export const taskSchema = z.object({
    title: z.string("error por dato invalido, el dato correcto es string").min(2, "la tarea debe tener por lo menos dos caracteres")
});

export const taskParamsSchema = z.object({
    id: z.coerce.number("el paramas debe ser un Numero")
});

export const updateTaskSchema = z.object({
    title: z.string("Debe ingresar una cadena de texto").optional(),
    completed: z.boolean("debe ser true o false").optional(),
});