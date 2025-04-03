import { z } from 'zod';

export const trainingSchema = z.object({
    area_laboral: z.number({
        required_error: "El área laboral es un campo requerido"
    }),
    agregar_informacion: z.string({
        required_error: "La información adicional es un campo requerido"
    }).min(5, {
        message: "La información adicional debe tener al menos 5 caracteres"
    }),
});

export const updateTrainingSchema = z.object({
    area_laboral: z.number({
        required_error: "El área laboral es un campo requerido"
    }),
    agregar_informacion: z.string({
        required_error: "La información adicional es un campo requerido"
    }).min(5, {
        message: "La información adicional debe tener al menos 5 caracteres"
    }).optional(),
});