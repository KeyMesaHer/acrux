import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logoblanco.png";
import imgRobot from "../assets/robot.png";
import flecha from '../assets/flechaa.png';

const AdminPage = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
      {/* HEADER */}
      <header className="bg-black text-white py-1 px-8">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <img className="w-[10vw] h-auto min-w-[50px] max-w-[100px] object-contain" src={logo} alt="Logo" />
          {/* Enlaces */}
            <div className="hidden md:flex space-x-20 items-center">
              <Link to="/users" className="hover:text-gray-300 text-lg">Gestión de usuarios</Link>
              <Link to={`/user/trainings/${user.id_usuario}`} className="hover:text-gray-300 text-lg">Información</Link>
              <Link to="/trainings" className="hover:text-gray-300 text-lg">Conocimientos</Link>
              <Link to="/areas" className="hover:text-gray-300 text-lg">Áreas laborales</Link>
            </div>

    {/* Menú móvil */}
    <div className="flex items-center gap-3">
      {/* Botón Menú (Siempre visible) */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white rounded-lg hover:bg-gray-600">
        <IoMenu className="text-2xl"/>
      </button>
        {/* Icono Usuario */}
          <img src={user.foto} alt="Foto de perfil" className="w-12 h-12 rounded-full object-cover border-2 border-white"/>      
        </div>
    </div>
        
    {/* Menú desplegable */}
    {isOpen && (
      <div className="absolute w-full left-0 bg-black shadow-lg mt-2 md:hidden">
        <ul className="flex flex-col text-center py-2">
          <li className="hover:bg-gray-600 py-2">
            <Link to="/users">Gestión de usuarios</Link>
          </li>
          <li className="hover:bg-gray-600 py-2">
            <Link to={`/user/trainings/${user.id_usuario}`}>Información</Link>
          </li>
          <li className="hover:bg-gray-600 py-2">
            <Link to="/trainings">Conocimientos</Link>
          </li>
          <li className="hover:bg-gray-600 py-2">
            <a href="#">Instrucciones de uso</a>
          </li>
          <li>
            <button onClick={logout} className="block w-full text-center px-4 py-2 text-red-600 hover:bg-gray-600">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
      )}

      {isOpen && (
        <div className="absolute right-8 bg-black shadow-lg mt--2 hidden md:block">
          <ul className="text-center py-2">
            <li className="hover:bg-gray-600 py-1 px-4">
              <a href="#">Instrucciones de uso</a>
            </li>
            <li>
              <button onClick={logout} className="block w-full text-center px-4 py-2 text-red-600 hover:bg-gray-600">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
      </header>
    

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow flex items-center justify-center mt-12 px-4">
        <div className="bg-black text-white rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 max-w-4xl w-full p-6">
          <img src={imgRobot} className="w-[100%] md:w-[40%] max-w-[400px] object-contain" alt="Robot"/>
            <div className="max-w-md text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">¡BIENVENIDO ADMINISTRADOR!</h1>
                <p className="text-lg mb-4"> Soy <strong>Acrux</strong> y estoy para impulsarte en todo lo que requieras, para ayudarte a mejorar cada día en tu área laboral.</p>
                <p className="text-xl font-bold ml-58">¡Conóceme mejor!</p>
                  <img src={flecha} alt="Flecha indicando" className="absolute bottom-21 right-58 w-40 h-18 hidden md:block"/>
            </div>
        </div>
        <Link to="/chat" className="fixed bottom-34 md:bottom-8 right-12 group">
          <button className="relative">
            <img src={imgRobot} className="w-16 h-16 md:w-32 md:h-32 rounded-full border-2 border-white" alt="ChatBot" />
          </button> 
          <span className="hidden group-hover:block absolute bottom-18 md:bottom-30 right-2 bg-gradient-to-r from-sky-950 to-sky-600 border-2 border-white text-white text-sm md:text-lg font-bold w-48 md:w-50 p-4 rounded-lg shadow-lg">
              Inicia tu conversación con el ChatBot!
          </span>
        </Link>
      </main>
    </div> 
  );
};

export default AdminPage;
