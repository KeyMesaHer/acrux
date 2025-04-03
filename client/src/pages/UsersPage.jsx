import { useEffect, useState } from "react";
import { useUsers } from "../context/UsersContext";
import { Link } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import usuario from "../assets/usuario.png";
import ModalDelete from "../manners/ModalDelete";
import ModalSearch from "../manners/ModalSearch";
import Navbar from "../components/Navbar";
import { GrDocumentPdf } from "react-icons/gr";
import { BsFiletypePdf } from "react-icons/bs";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const UsersPage = () => {
const { getUsers, users, deleteUser, downloadPDF, downloadExcel, downloadPDFByRol, downloadExcelByRol  } = useUsers();
const [modalOpen, setModalOpen] = useState(false);
const [searchModalOpen, setSearchModalOpen] = useState(false); 
const [searchTerm, setSearchTerm] = useState("");
const [userIdToDelete, setUserIdToDelete] = useState(null);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);

useEffect(() => {
  getUsers();
}, []);

const handleDeleteClick = (id) => {
  setUserIdToDelete(id);
  setModalOpen(true);
};

const confirmDelete = () => {
  deleteUser(userIdToDelete);
  setModalOpen(false);
};

const handleSearch = (term) => {
  setSearchTerm(term.toLowerCase());
};

const handleImageClick = (image) => {
  setSelectedImage(image);
};

const filteredUsers = users.filter(user =>
  user.nombre.toLowerCase().includes(searchTerm) ||
  user.cedula.includes(searchTerm) ||
  user.cargo.toLowerCase().includes(searchTerm) ||
  user.email.toLowerCase().includes(searchTerm)
);
  
return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
    <Navbar />
      <div className="container mx-auto px-4 py-8">
        
        {/* Dropdown de reportes */}
        <div className="flex justify-end mb-4">
          <div className="relative inline-block text-left">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#0170b8] text-white px-4 py-2 right-20 rounded-lg hover:bg-black hover:text-white flex items-center gap-2">
              <BsFiletypePdf className="text-3xl "/>
            </button>

            {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-black text-white rounded-lg shadow-lg z-10">
              <ul className="py-2">
                <li className="px-4 py-2 font-bold text-white">Usuarios</li>
                  <li>
                    <button onClick={downloadPDF} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                      <GrDocumentPdf className="mr-2" /> Descargar PDF
                    </button>
                  </li>
                  <li>
                    <button onClick={downloadExcel} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                      <PiMicrosoftExcelLogoFill className="mr-2" /> Descargar Excel
                    </button>
                  </li>
                  <hr className="border-gray-300 my-2" />
                  <li className="px-4 py-2 font-bold text-white">Roles</li>
                  <li>
                    <button onClick={downloadPDFByRol} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                      <GrDocumentPdf className="mr-2" /> Descargar PDF
                    </button>
                  </li>
                  <li>
                    <button onClick={downloadExcelByRol} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                      <PiMicrosoftExcelLogoFill className="mr-2" /> Descargar Excel
                    </button>
                  </li>
              </ul>
            </div>
          )}
        </div>
      </div>

        {/* Tabla en pantallas grandes */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border border-white text-left text-white rounded-lg">
          <thead>
            <tr className=" text-center">
              <th className="px-4 py-2 border border-white">Usuario</th>
              <th className="px-4 py-2 border border-white">Nombre</th>
              <th className="px-4 py-2 border border-white">Cédula</th>
              <th className="px-4 py-2 border border-white">Cargo</th>
              <th className="px-4 py-2 border border-white">Email</th>
              <th className="px-4 py-2 border border-white">
              <button className="text-white-400 hover:text-black">
                <Link to="/register">
                    <FaUserPlus size={30} />
                </Link>
              </button>
              </th>
              <th className="px-4 py-2 border border-white">
                <button className="text-white-400 hover:text-black" onClick={() => setSearchModalOpen(true)}>
                  <FaSearch size={23} />
                </button>
              </th>
            </tr>
          </thead>
        
          <tbody>
            {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-3 px-4 text-center">No hay usuarios disponibles</td>
            </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id_usuario} className="hover:bg-gray-800 text-center">
                  <td className="py-3 px-4 border border-white">
                    <img src={user.foto} className="w-12 h-12 rounded-full mx-auto cursor-pointer object-cover" onClick={() => handleImageClick(user.foto)}alt="User" />                    
                  </td>
                  <td className="px-4 py-2 border border-white">{user.nombre}</td>
                  <td className="px-4 py-2 border border-white">{user.cedula}</td>
                  <td className="px-4 py-2 border border-white">{user.cargo}</td>
                  <td className="px-4 py-2 border border-white">{user.email}</td>
                  <td className="px-2 py-2 border border-white text-center">
                  <button>
                    <Link to={`/user/${user.id_usuario}`} className="text-blue-400 hover:text-blue-600">
                      <FaEdit size={22} />
                    </Link>
                  </button>
                  </td>
                  <td className="px-4 py-2 border border-white text-center">
                    <button className="text-red-400 hover:text-red-600" onClick={() => handleDeleteClick(user.id_usuario)}>
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    {/* Tabla en dispositivos móviles */}
  <div className="lg:hidden w-full overflow-x-auto">
    <table className="w-full border-collapse border border-white text-white">
      <tbody>
        <thead>
          <th className="px-3 py-2 border border-white">
            <button className="text-white-400 hover:text-black">
              <Link to="/register">
                <FaUserPlus size={30} />
              </Link>
            </button>
          </th>
          <th className="px-3 py-2 border border-white">
            <button className="text-white-400 hover:text-black" onClick={() => setSearchModalOpen(true)} >
              <FaSearch size={23} />
            </button>
          </th>
        </thead>
        {filteredUsers.length === 0 ? (
        <tr>
          <td colSpan="3" className="py-3 px-4 text-center">No hay usuarios disponibles</td>
        </tr>
        ) : (
        filteredUsers.map((user) => (
          <tr key={user.id_usuario} className="border-b border-white">

            {/* Columna de Imagen */}
            <td className="max-w-screen-sm w-full border border-white text-center">
              <img src={user.foto} alt="User" className="w-12 h-12 rounded-full mx-auto object-cover" />
            </td>
            <td className= " w-full border border-white text-left">
              <p className="py-2 px-4 border border-white"> {user.nombre}</p>
              <p className="py-2 px-4 border border-white">{user.cedula}</p>
              <p className="py-2 px-4 border border-white"> {user.cargo}</p>
              <p className="py-2 px-4 border border-white">{user.email}</p>
              <p className="py-2 px-4 border border-white"> *****</p>
            </td>

            {/* Columna de Acciones */}
            <td className="py-3 px-4 border border-white text-center">
              <Link to={`/user/${user.id_usuario}`} className="text-blue-400 hover:text-blue-600 block mb-2">
                <FaEdit size={24} />
              </Link>
              <button className="text-red-400 hover:text-red-600" onClick={() => handleDeleteClick(user.id_usuario)}>
                <FaTrash size={22} />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  {/* Regresar a los usuarios */}
  {searchTerm && (
    <div className="text-left px-15 mt-2">
      <button  onClick={() => setSearchTerm("")}  className="text-white-400 hover:text-blue-600 transition underline">  ← Ver todo</button>
    </div>
  )}
</div>

<ModalDelete isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmDelete} />
<ModalSearch isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onSearch={handleSearch} />
  {selectedImage && (
<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div className="relative">
    <button  className="absolute top-2 right-2 text-white text-3xl"  onClick={() => setSelectedImage(null)}>&times;</button>
      <img src={selectedImage} className="max-w-full max-h-screen rounded-lg" alt="User" />
  </div>
</div>
)}
</div>
);
};

export default UsersPage;