import OpenAI from "openai";
import dotenv from "dotenv";
import { obtenerDatos, insertarChat, getChatByUser, getChatById } from "../models/chat.model.js"; 
dotenv.config();

// Obtener la apiKey de OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const procesarChat = async (req, res) => {
    try {
        const { message } = req.body;
        const id_usuario = req.user?.id_usuario; 
        
        //Autenticación de usuario
        if (!id_usuario) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        
        // Verificar que se haya enviado un mensaje
        if (!message) {
            return res.status(400).json({ error: "El mensaje es requerido" });
        }

        // Obtener los entrenamientos creados
        const entrenamientos = await obtenerDatos();

        // Contexto de respueta para el chat
        const contexto = entrenamientos.length > 0
            ? `Aquí está la información relevante: ${JSON.stringify(entrenamientos)}, usa esta información para responder de manera adecuada.`
            : "No encontré información en mi base de datos, pero intentaré responder.";

        // chat
        const response = await openai.chat.completions.create({
            model: "gpt-4", //Modelo del chat
            messages: [
                { role: "system", content: contexto },
                { role: "user", content: message },
            ],
        });
        
        // Dar la respuesta o el error según el caso
        const respuesta = response.choices?.[0]?.message?.content || "No se pudo obtener respuesta.";

        // Guardar los datos del chat en la base de datos
        await insertarChat({ id_usuario, pregunta: message, respuesta });
        res.json({ reply: respuesta });
    } catch (error) {
        console.error("Error en el chat:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

// Obtener chats de un usuario
export const chatByUser = async (req, res) => {
    try {
        const {id_usuario} = req.params;
        const chats= await getChatByUser(id_usuario);
        // Verificar que el usuario tenga chats creados
        if(!chats) {
            return res.status(404).json({ message: 'No se encontraron chats para este usuario'});
        }
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los chats', error});
        
    }
}

// Chat por ID
export const chatById = async (req, res) => {
    try {
        const { id_chat } = req.params;
        const chat = await getChatById(id_chat);

        // Buscar chat
        if (!chat.length) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }
        res.json(chat[0]); 
    } catch (error) {
        res.status(500).json({ message: "Error al obtener chat", error });
    }
};