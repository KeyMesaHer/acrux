import { Router } from 'express';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { trainingSchema, updateTrainingSchema } from '../schemas/training.schema.js';  // importamos el esquema de validación de los datos de entrada
import { createTrainingController, updateTrainingController, getTrainingsByUserIdController, getAllTrainingsController, deleteTrainingController, } from '../controllers/training.controllers.js';
import { requiredAuth } from "../middlewares/tokenValidation.js";
import { getTrainingsPDF, getTrainingsEXCEL, getTrainingsByAreaPDF, getTrainingsByAreaEXCEL } from '../controllers/report.controller.js';

const router = Router();

// Entrenamientos por usuario
router.get('/user/trainings/:id_usuario', requiredAuth, getTrainingsByUserIdController);
// Todos los entrenamientos
router.get('/trainings',requiredAuth,  getAllTrainingsController);
// Nuevo entrenamiento
router.post('/newTraining', requiredAuth, validateSchema(trainingSchema), createTrainingController);
// Editar entrenamiento existente
router.put('/training/:id_entrenamiento',requiredAuth, validateSchema(updateTrainingSchema), updateTrainingController);
// Eliminar entrenamiento existente
router.delete('/training/:id_entrenamiento',requiredAuth, deleteTrainingController);
// Generar reportes de los entrenamientos
router.get('/trainings/report/pdf', requiredAuth, getTrainingsPDF );
router.get('/trainings/report/excel', requiredAuth, getTrainingsEXCEL);
router.get('/trainings/areas/report/pdf', requiredAuth, getTrainingsByAreaPDF );
router.get('/trainings/areas/report/excel', requiredAuth, getTrainingsByAreaEXCEL);



export default router;
