import React, { useState, useEffect, useRef } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { FiMenu } from "react-icons/fi";
import { FaLongArrowAltLeft } from "react-icons/fa";
import logo from "../assets/logoblanco.png";
import robotImage from "../assets/robot.png";
import { useAuth } from "../context/AuthContext";
import { useChats } from "../context/chatContext";
import { chatRequest } from '../api/chat';
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { type: "answer", text: "Bienvenido al Centro de Conocimiento Empresarial Acrux. ¿En qué puedo ayudarte?", isBotIntro: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { chats, getChatByUser } = useChats();
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id_usuario) {
      getChatByUser(user.id_usuario);
    }
  }, [user, getChatByUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && user) {
      const newMessage = { type: "question", text: input };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      try {
        const { data } = await chatRequest({ message: input, id_usuario: user.id_usuario });
        setMessages((prev) => [...prev, { type: "answer", text: data.reply }]);
      } catch (error) {
        setMessages((prev) => [...prev, { type: "answer", text: "Hubo un error en la respuesta. Intenta nuevamente." }]);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black to-[#0170b8] text-white">
      {/* Botón para mostrar el menú en móviles */}
      <button className="absolute top-4 left-4 md:hidden text-white text-2xl z-50" onClick={() => setShowSidebar(!showSidebar)}>
        <FiMenu />
      </button>

      {/* Sidebar */}
      
        <aside className={`fixed md:relative inset-y-0 left-0 bg-gradient-to-br from-black to-[#0170b8] w-72 md:w-64 p-4 border-r border-white transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <img src={logo} alt="Entidad" className="w-32 mx-auto mb-4" />
        <div className="mt-2 max-h-80 overflow-y-auto space-y-2 p-2">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div key={chat.id_chat} className="p-2 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-40" onClick={() => navigate(`/chat/${chat.id_chat}`)}>
                {new Date(chat.fecha).toLocaleString()}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No hay chats disponibles</p>
          )}
        </div>
        <button className="mt-9 w-53  border border-white  bg-gradient-to-br from-black to-[#0170b8] hover:bg-sky-500 text-white py-1 rounded-lg flex items-center justify-center gap-2" onClick={() => navigate(user?.rol === "1" ? "/admin" : "/employee")}> 
          <FaLongArrowAltLeft size={30} />
        </button>
      </aside>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col h-screen md:ml-1 bg-black">
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarColor: '#0170b8 transparent' }}>
  {messages.map((message, index) => (
    <div key={index} className={`flex items-start ${message.type === "question" ? "justify-end" : "justify-start"}`}>
      {message.isBotIntro && <img src={robotImage} alt="Bot" className="w-15 h-15 mr-2" />}
      <p className={`px-4 py-3 rounded-lg max-w-lg ${message.type === "question" ? "bg-gradient-to-br from-black to-[#0170b8] border border-white text-white" : "bg-gradient-to-br from-black to-[#0170b8] border border-white text-white"}`}>
        {message.text}
      </p>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>


        {/* Input */}
        <div className="p-4 border-t border-white flex items-center bg-black">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent text-white border border-white rounded-full px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="ml-4 w-10 h-10 bg-sky-600 hover:bg-sky-500 text-white rounded-full flex items-center justify-center">
            <LuSendHorizontal size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
