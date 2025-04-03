import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import logo from "../assets/logoblanco.png";

const Navbar = () => {
const { user, logout } = useAuth();
const [isOpen, setIsOpen] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);

return (
  <div>
    {/* HEADER */}
      <header className="bg-black text-white py-1 px-8 relative">
        <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
          <img className="w-[13vw] h-auto min-w-[50px] max-w-[100px] object-contain" src={logo} alt="Logo" />
        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-20 items-center">
          {user?.rol === "1" ? ( // Admin
            <>
              <Link to="/admin" className="hover:text-gray-300"> Inicio </Link>
              <Link to="/users" className="hover:text-gray-300"> Gestión de usuarios </Link>
              <Link to="/trainings" className="hover:text-gray-300"> Conocimientos </Link>
              <Link to="/areas" className="hover:text-gray-300"> Áreas laborales </Link>
            </>
          ) : ( // Empleado
              <Link to="/employee" className="hover:text-gray-300"> IniciO </Link>
              )}
            <Link to={`/user/trainings/${user?.id_usuario}`} className="hover:text-gray-300"> Información </Link>
        </div>
        
        {/* Menú móvil + Usuario */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              console.log("Menú abierto:", !isOpen);
            }}
              className="p-2 text-white rounded-lg hover:bg-gray-600"
            >
            <IoMenu className="text-2xl" />
          </button>

          {/* Foto de Usuario */}
            <img
              src={user?.foto}
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full object-cover border-2 border-white cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* Menú desplegable móvil */}
        <div
          className={`absolute top-full left-0 w-full bg-black shadow-lg md:hidden transition-all duration-100 ease-out z-99 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`} >
          <ul className="flex flex-col text-center py-2">
            {user?.rol === "1" ? ( // Admin
              <>
                <li className="hover:bg-gray-600 py-2">
                  <Link to="/admin"> Inicio </Link>
                </li>
                <li className="hover:bg-gray-600 py-2">
                  <Link to="/users"> Gestión de usuarios </Link>
                </li>
                <li className="hover:bg-gray-600 py-2">
                  <Link to="/trainings"> Conocimientos </Link>
                </li>
                <li className="hover:bg-gray-600 py-2">
                  <Link to="/areas"> Áreas laborales </Link>
                </li>
              </>
            ) : ( // Empleado
              <li className="hover:bg-gray-600 py-2">
                <Link to="/employee"> Inicio </Link>
              </li>
            )}
            <li className="hover:bg-gray-600 py-2">
              <Link to={`/user/trainings/${user?.id_usuario}`}> Información </Link>
            </li>
            <li>
              <button onClick={logout} className="block w-full text-center px-4 py-2 text-red-600 hover:bg-gray-600"> Cerrar sesión </button>
            </li>
          </ul>
        </div>
      </header>

      {/* Modal de Imagen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img src={user?.foto} alt="Foto de perfil ampliada" className="max-w-full max-h-screen rounded-lg"/>
            <button
              className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full text-lg"
              onClick={() => setIsModalOpen(false)} >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;