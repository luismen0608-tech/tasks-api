//taskSchema.ts
import z from 'zod';

export const taskSchema = z.object({
    title: z.string("error por dato invalido, el dato correcto es string").trim().min(2, "la tarea debe tener por lo menos dos caracteres")
});

export const taskParamsSchema = z.object({
    id: z.coerce.number("el paramas debe ser un Numero").positive("debe ser un numero mayor a 0").int().max(2147483647)
});

export const updateTaskSchema = z.object({
    title: z.string("Debe ingresar una cadena de texto").trim().min(2, "la tarea debe tener por lo menos dos caracteres").optional(),
    completed: z.boolean("debe ser true o false").optional(),
});