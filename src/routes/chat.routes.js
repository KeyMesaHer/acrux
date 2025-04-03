import { Router } from "express";
import { procesarChat, chatByUser, chatById } from '../controllers/chat.controller.js';
import { requiredAuth } from "../middlewares/tokenValidation.js";

const router = Router();

// Chat nuevo
router.post('/chat', requiredAuth, procesarChat);
// Chats por usuario
router.get('/user/chats/:id_usuario', requiredAuth, chatByUser )
// Chat por ID  (Historial)
router.get('/chat/:id_chat', requiredAuth, chatById )

export default router;