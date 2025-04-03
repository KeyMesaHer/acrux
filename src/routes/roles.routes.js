import { Router } from "express";
import { getAllRoles } from "../controllers/roles.controller.js";
import { requiredAuth } from "../middlewares/tokenValidation.js";

const router = Router();

// Obtener todos los roles
router.get('/roles', requiredAuth, getAllRoles);

export default router;