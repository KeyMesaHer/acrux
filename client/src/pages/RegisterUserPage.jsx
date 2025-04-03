import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getRoles } from '../api/roles.js';
import uploadIcon from '../assets/upload.png';
import defaultImage from '../assets/default.png';
import Navbar from '../components/Navbar.jsx';
import { FaRegSave } from "react-icons/fa";
import ModalErrors from '../manners/ModalErrors.jsx'; 

const RegisterUserPage = () => {
const { register, handleSubmit, formState: { errors } } = useForm();
const { signup, isAuthenticated, errors: registerErrors = [] } = useAuth(); 
const navigate = useNavigate();
const [selectedImage, setSelectedImage] = useState(null);
const [roles, setRoles] = useState([]);
const [previewImage, setPreviewImage] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);

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

const onSubmit = handleSubmit(async (values) => {
  try {

    const formData = new FormData();
    if (selectedFile) {
      formData.append("foto", selectedFile);
    }
    for (const key in values) {
      formData.append(key, values[key]);
    }

    const success = await signup(formData);  
    if (success) {
      navigate('/users'); 
    }
} catch (error) {
    console.error("Error al registrar usuario:", error);
}
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file); 
    setPreviewImage(URL.createObjectURL(file)); 
  }
};

return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
    <Navbar />
      <main className="flex flex-col items-center w-full max-w-4xl mx-auto">

        <div className="w-full border-b border-gray-400 flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-bold text-white">Registrar usuario</h2>
          <button type="submit" form="registerForm" className="bg-gradient-to-br from-black to-[#0170b8] rounded-md text-white p-2 hover:bg-blue-200">
            <FaRegSave size={25} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full mt-6">

          {/* Imagen de perfil */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {errors.foto && <p className="text-red-500 text-sm mt-1">La foto es requerida</p>}
            <div className="w-60 md:w-100 h-60 md:h-100 rounded-full md:rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
              <img src={previewImage || defaultImage} alt="Imagen de perfil" className="w-full h-full object-cover" />
            </div>
            <label className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md cursor-pointer mt-4 hover:bg-gray-200">
              <img src={uploadIcon} alt="Subir" className="w-4 h-4" />
              <span className="text-sm font-semibold">Cargar foto</span>
              <input type="file" name="foto" {...register("foto", { required: true })} onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Formulario */}
          <form id="registerForm" onSubmit={onSubmit} className="w-full md:w-1/2 space-y-4 mb-6">
            {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
              <div className="bg-red-500 text-white p-2 rounded-md text-center" key={i}>{error}</div>
            ))}
            <div>
              <label className="text-white font-bold block mb-1 ml-10">Nombre</label>
              <input type="text" {...register("nombre", { required: true })} className="w-[90%] mx-6 bg-white text-black px-4 py-2 rounded-md" placeholder="Ingrese su nombre" />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">Nombre es requerido</p>}
            </div>

            <div>
              <label className="text-white font-bold block mb-1 ml-10">Cédula</label>
              <input type="number" {...register("cedula", { required: true })} className="w-[90%] mx-6 bg-white text-black px-4 py-2 rounded-md" placeholder="Ingrese su cédula" />
              {errors.cedula && <p className="text-red-500 text-sm mt-1">Cédula es requerida</p>}
            </div>

            <div>
              <label className="text-white font-bold block mb-1 ml-10">Email</label>
              <input type="email" {...register("email", { required: true })} className="w-[90%] mx-6 bg-white text-black px-4 py-2 rounded-md" placeholder="Ingrese su email" />
              {errors.email && <p className="text-red-500 text-sm mt-1">Email es requerido</p>}
            </div>

            <div>
              <label className="text-white font-bold block mb-1 ml-10">Contraseña</label>
              <input type="password" {...register("password", { required: true })} className="w-[90%] mx-6 bg-white text-black px-4 py-2 rounded-md" placeholder="Ingrese su contraseña" />
              {errors.password && <p className="text-red-500 text-sm mt-1">Contraseña es requerida</p>}
            </div>

            <div>
              <label className="text-white font-bold block mb-1 ml-10">Cargo</label>
              <input type="text" {...register("cargo", { required: true })} className="w-[90%] mx-6 bg-white text-black px-4 py-2 rounded-md" placeholder="Ingrese su cargo" />
              {errors.cargo && <p className="text-red-500 text-sm mt-1">Cargo es requerido</p>}
            </div>

            <div>
              <label className="text-white font-bold block mb-1 ml-10">Rol</label>
              <select {...register("rol", { required: true, valueAsNumber: true })} className="w-[90%] mx-6 bg-white text-gray-500 px-4 py-2 rounded-md">
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>{rol.rol}</option>
                ))}
              </select>
                {errors.rol && <p className="text-red-500 text-sm mt-1">Rol es requerido</p>}
            </div>
          </form>
            {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
              <div className="bg-red-500 text-white p-2 rounded-md text-center" key={i}>{error}</div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default RegisterUserPage;