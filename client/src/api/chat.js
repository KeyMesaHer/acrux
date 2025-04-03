import axios from './axios';

// Enviar pregunta del chat
export const chatRequest = (chat) => axios.post(`/chat`, chat);
// Obtener los chats por usuario
export const getChatUserRequest = (id_usuario) => axios.get(`/user/chats/${id_usuario}`);
// Obtener chats
export const getChatByIdRequest = (id_chat) => axios.get(`/chat/${id_chat}`);