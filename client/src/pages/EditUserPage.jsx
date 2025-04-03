import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { FaRegSave } from "react-icons/fa";
import uploadIcon from '../assets/upload.png';
import defaultImage from '../assets/default.png';
import Navbar from "../components/Navbar.jsx";
import { getRoles } from '../api/roles.js';

const EditUserPage = () => {
const { id } = useParams();
const { users, updateUser } = useUsers();
const navigate = useNavigate();
const userId = parseInt(id, 10);
const [selectedImage, setSelectedImage] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
const [roles, setRoles] = useState([]);
    
const [userData, setUserData] = useState({
    nombre: "",
    cedula: "",
    email: "",
    cargo: "",
    rol: "",
    foto: ""
});

useEffect(() => {
    if (!id) {
        console.error("ID no encontrado en los parámetros.");
        return;
    }

    const userToEdit = users.find((user) => user.id_usuario === userId);
    if (userToEdit) {
        setUserData(userToEdit);
        setSelectedImage(userToEdit.foto || defaultImage);
    } else {
        console.error("Usuario no encontrado.");
    }
}, [id, users, userId]);

useEffect(() => {
    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error("Error al obtener roles", error);
        }
    };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || isNaN(userId)) {
            console.error("No se puede actualizar sin un ID válido");
            return;
        }

    const formData = new FormData();
        formData.append("email", userData.email);
        formData.append("cargo", userData.cargo);

    if (selectedFile) {
            formData.append("foto", selectedFile);
        }

    try {
        console.log("Enviando actualización de usuario:", userId, formData);
        await updateUser(userId, formData);
        navigate("/users");
    } catch (error) {
            console.error("Error al actualizar usuario:", error);
    }
};

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
            reader.readAsDataURL(file);
    }
};

return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
        <Navbar />
            <main className="items-start max-w-6xl mx-auto">

                {/* Titulo e ícono guardar */}
            <div className="col-span-2 border-b border-gray-400 flex justify-between items-center w-full pl-10 mt-9 mb-8">
                <h2 className="text-lg font-bold text-white">Editar Información de Usuario</h2>
                <button 
                    type="button" 
                    className="bg-gradient-to-br from-black to-[#0170b8] rounded md:rounded-lg text-white p-2 hover:bg-blue-200"
                    onClick={handleSubmit}>
                <FaRegSave size={25} />
                </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
                <div className="flex flex-col items-center space-y-4 w-full self-start">
                    <div className="w-100 h-100 rounded-full md:rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                        <img src={selectedImage} alt="Imagen de perfil" className="w-full h-full object-cover" />
                    </div>

                    <label className="flex items-center space-x-1 bg-white text-black px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200">
                        <img src={uploadIcon} alt="Subir" className="w-5 h-5" />
                        <span className="text-sm font-semibold">Cargar foto del usuario</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>
                <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">

                <div className="mb-6">
                    <label className="text-white font-bold block mb-2">Nombre</label>
                    <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} className="w-full bg-white text-black px-4 py-3 rounded-full" readOnly />
                </div>

                <div className="mb-6">
                    <label className="text-white font-bold block mb-2">Cédula</label>
                    <input type="text" name="cedula" value={userData.cedula} onChange={handleChange} className="w-full bg-white text-black px-4 py-3 rounded-full" readOnly />
                </div>

                <div className="mb-6">
                    <label className="text-white font-bold block mb-2">Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} className="w-full bg-white text-black px-4 py-3 rounded-full" />
                </div>
                
                <div className="mb-6">
                    <label className="text-white font-bold block mb-2">Cargo</label>
                    <input type="text" name="cargo" value={userData.cargo} onChange={handleChange} className="w-full bg-white text-black px-4 py-3 rounded-full" />
                </div>

                <div className="mb-6">
                    <label className="text-white font-bold block mb-2">Rol</label>
                    <input type="text" name="rol" value={userData.rol} onChange={handleChange} className="w-full bg-white text-black px-4 py-3 rounded-full" readOnly />
                </div>
                </form>
            </div>
        </main>
    </div>
);
};

export default EditUserPage;