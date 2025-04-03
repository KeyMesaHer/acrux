import { createContext, useContext, useState } from "react";
import { getChatUserRequest, getChatByIdRequest } from "../api/chat";

const ChatContext = createContext();

export const useChats = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
};

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);

  // Obtener chat del usuario
  const getChatByUser = async (userId) => {
    try {
      const res = await getChatUserRequest(userId);
      setChats(res.data);
    } catch (error) {
      console.error("Error al obtener los chats del usuario", error.response?.data || error);
    }
  };

  // Chat por Id
  const getChatById = async (chatId) => {
    try {
      const res = await getChatByIdRequest(chatId);
      return res.data; 
    } catch (error) {
      console.error("Error al obtener el chat por ID", error.response?.data || error);
    }
  };

  return (
    <ChatContext.Provider value={{ chats, getChatByUser, getChatById  }}> {children} </ChatContext.Provider>
  );
}
