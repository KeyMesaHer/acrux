import { Router } from "express";
import { register, login, logout, profile, verifyToken, getUsers, updateUserById, deleteUserById, recoverPassword, resetPassword } from "../controllers/auth.controller.js";
import { requiredAuth } from "../middlewares/tokenValidation.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { getusersEXCEL, getUsersPDF, getUsersByRolPDF, getUsersByRolEXCEL } from "../controllers/report.controller.js";
import { upload } from '../config/multer.config.js';

const router = Router();

// Registrar usuario
router.post('/register',upload.single('foto'), requiredAuth, validateSchema(registerSchema), register);
// Loguin 
router.post('/login', validateSchema(loginSchema), login);
// Cerrar sesión
router.post('/logout', requiredAuth, logout);  
// Verficar Token
router.get('/verify', requiredAuth, verifyToken);  
// Perfil
router.get('/profile', requiredAuth, profile);
// Usuarios
router.get('/users',requiredAuth, getUsers);
// Actualizar usuarios
router.put('/user/:id_usuario',upload.single('foto'), requiredAuth, updateUserById);
// Eliminar usuarios
router.delete('/user/:id_usuario', requiredAuth, deleteUserById);
// Actualización y recuperación de contraseñas
router.post('/recover', recoverPassword); // Ruta para solicitar recuperación de contraseña
router.post('/reset/:token', resetPassword); // Ruta para restablecer la contraseña
//Generar reporte de todos los usuarios.
router.get('/users/report/pdf', requiredAuth, getUsersPDF);
router.get('/users/report/excel', requiredAuth, getusersEXCEL);
router.get('/users/rol/report/pdf', requiredAuth, getUsersByRolPDF);
router.get('/users/rol/report/excel', requiredAuth, getUsersByRolEXCEL);


export default router;
