import { Router } from "express";
import { newArea, getAllAreas, updateArea, deleteArea } from "../controllers/area.controller.js";
import { requiredAuth } from "../middlewares/tokenValidation.js";


const router = Router();

// Obtener todas las áreas
router.get('/areas', requiredAuth,  getAllAreas);
// Crear nueva área laboral
router.post('/newArea', requiredAuth, newArea);
// Editar área laboral
router.put('/area/:id_area', requiredAuth, updateArea);
// Eliminar área laboral 
router.delete('/area/:id_area', requiredAuth, deleteArea);

export default router;