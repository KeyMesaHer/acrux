import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChats } from "../context/chatContext";
import logo from "../assets/logoblanco.png";
import botImage from "../assets/robot.png";
import { FiMenu } from "react-icons/fi";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";


const HistoryChat = () => {
  const { id_chat } = useParams();
  const { getChatById, chats } = useChats();
  const [chat, setChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChat = async () => {
      const data = await getChatById(id_chat);
      if (data) setChat(data);
    };
    fetchChat();
  }, [id_chat, getChatById]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!chat) return <p className="text-white text-center mt-10">Cargando chat...</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black to-[#0170b8] text-white">
      <button className="absolute top-4 left-4 md:hidden text-white text-2xl z-50" onClick={() => setShowSidebar(!showSidebar)}>
        <FiMenu />
      </button>

      <aside className={`fixed md:relative inset-y-0 left-0 bg-gradient-to-br from-black to-[#0170b8] w-72 md:w-64 p-4 border-r border-white transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <img src={logo} alt="Entidad" className="w-32 mx-auto mb-4" />
        <button
          className="mb-4 px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg w-full justify-center"
          onClick={() => navigate("/chat")}
        >
          <FaRegPlusSquare /> Nuevo Chat
        </button>        <div className="mt-2 max-h-80 overflow-y-auto space-y-2 p-2">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((c) => (
              <div key={c.id_chat} className="p-2 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-40" onClick={() => navigate(`/chat/${c.id_chat}`)}>
                {new Date(c.fecha).toLocaleString()}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No hay chats disponibles</p>
          )}
        </div>
        <button className="mt-9 w-53 border border-white bg-gradient-to-br from-black to-[#0170b8] hover:bg-sky-500 text-white py-1 rounded-lg flex items-center justify-center gap-2" onClick={() => navigate("/chat")}> 
          <FaLongArrowAltLeft size={30} />
        </button>
      </aside>

      <main className="flex-1 flex flex-col h-screen md:ml-1 bg-black">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 border-white">
            Chat del {chat.fecha ? new Date(chat.fecha).toLocaleString() : "Fecha desconocida"}
          </h2>
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">
            <div className="flex justify-end">
              <p className="px-6 py-3 rounded-lg max-w-md bg-gradient-to-br from-black to-[#0170b8] border border-white text-white">
                {chat.pregunta || "Sin pregunta"}
              </p>
            </div>
            <div className="flex items-start">
              <img src={botImage} alt="Bot" className="w-10 h-10 rounded-full mr-3" />
              <p className="px-6 py-3 rounded-lg max-w-md bg-gradient-to-br from-black to-[#0170b8] border border-white text-white">
                {chat.respuesta || "Sin respuesta"}
              </p>
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      </main>
    </div>
  );
};

export default HistoryChat;
