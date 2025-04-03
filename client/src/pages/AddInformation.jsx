import React, { useState, useEffect } from 'react';
import { useTrainings } from "../context/TrainingsContext";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import ModalDeleteInfo from '../manners/ModalDeleteInfo';
import Navbar from '../components/Navbar';
import { getAreas } from '../api/areas.js';

const AddInformation = () => {
const { trainings, getTrainingsByUser , createTraining, updateTraining, deleteTraining } = useTrainings();
const { user } = useAuth();
const [areas, setAreas] = useState([]);
const [area_laboral, setAreaLaboral] = useState('');
const [agregar_informacion, setInformacion] = useState('');
const [editId, setEditId] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [trainingToDelete, setTrainingToDelete] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
  
// Cargar las áreas laborales
useEffect(() => {
  const areas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
    }catch (error) {
      console.error("Error al obtener áreas", error);
    }
};
    areas();
}, []);

// Obtener solo los entrenamientos del usuario autenticado 
useEffect(() => {
  if (user && user.id_usuario) {
      getTrainingsByUser(user.id_usuario).then(() => console.log("Trainings cargados:", trainings));
  }
    getAreas().then(() => console.log("Áreas cargadas:", areas));
}, [user]);
  
// Guardar el editar y el crear
const handleGuardar = async () => {
  if (String(area_laboral).trim() === '' || agregar_informacion.trim() === '') {
    alert('Por favor, completa todos los campos.');
    return;
  }
  const trainingData = {
    area_laboral: parseInt(area_laboral, 10), 
    agregar_informacion
  };
  if (editId) {
    await updateTraining(editId, trainingData);
    setEditId(null);
  } else {
    await createTraining(trainingData);
  }

    setAreaLaboral('');
    setInformacion('');

  if (user && user.id_usuario) {
    await getTrainingsByUser(user.id_usuario);
  }
};

const handleEdit = (training) => {
  setAreaLaboral(training.area_laboral);
  setInformacion(training.agregar_informacion);
  setEditId(training.id_entrenamiento);
};

  // Abrir modal eliminar
const openModal = (training) => {
    setTrainingToDelete(training);
    setIsModalOpen(true);
};

  // Cerrar modal eliminar
const closeModal = () => {
    setIsModalOpen(false);
    setTrainingToDelete(null);
};

const confirmDelete = async () => {
  if (trainingToDelete) {
    await deleteTraining(trainingToDelete.id_entrenamiento);
    closeModal();
  if (user && user.id_usuario) {
    await getTrainingsByUser(user.id_usuario);
    }
  }
};

  // Filtrar entrenamientos según la búsqueda
const filteredTrainings = trainings.filter(training => 
  String(training.area_laboral)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  training.agregar_informacion?.toLowerCase().includes(searchTerm.toLowerCase())
);
  
return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
    <Navbar />
      <main className="p-6">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-start">
          <div className="w-full max-w-lg mx-auto">

            {/* Barra de búsqueda */}
            <div className="relative mb-6">
              <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-4 w-6 h-6 text-white" />
              <input type="text"  className="w-full bg-transparent text-white pl-12 pr-4 py-2 border border-white rounded-full"  placeholder="Buscar Información" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Lista desplegable de Área Laboral */}
            <div className="mb-6">
              <label className="text-white font-bold block mb-2"> Área Laboral </label>
              <select className="w-full bg-white text-black px-4 py-3  appearance-none rounded-full"
                value={area_laboral} onChange={(e) => setAreaLaboral(e.target.value)}>
                <option  value="">Seleccione un área</option>
                  {areas.map(area => (
                  <option    key={area.id_area} value={area.id_area.toString()}>
                      {area.area_laboral}
                  </option>
                ))}
              </select>

              <div className="absolute bottom-101 md:bottom-94 left-104 md:left-138 flex items-center">
                <FaChevronDown className="text-black text-lg" />
              </div>
            </div>

            <div className="mb-8">
              <label className="text-white font-bold block mb-2"> Información: </label>
              <textarea className="w-full bg-white text-black px-4 py-3 rounded-2xl" rows={4} placeholder="Escribe aquí la información" value={agregar_informacion} onChange={(e) => setInformacion(e.target.value)}></textarea>
            </div>

            <button onClick={handleGuardar} className="w-full bg-gradient-to-r border border-2 from-sky-950 to-sky-600 text-white font-semibold py-3 rounded-full hover:scale-105 transition duration-500">
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>

        {/* Tabla */}
          <div className="w-full flex justify-start overflow-x-auto">
            <table className="min-w-full text-white border border-white rounded-lg table-fixed">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b border-white w-1/4 text-left"> Área laboral </th>
                  <th className="px-3 py-2 border-b border-white w-1/2 text-left"> Información </th>
                  <th className="px-2 py-2 border-b border-white w-1/8"></th>
                  <th className="px-2 py-2 border-b border-white w-1/8"></th>
                </tr>
              </thead>

              <tbody>
                {filteredTrainings.length > 0 ? filteredTrainings.map((training) => (
                  <tr key={training.id_entrenamiento}>
                    <td className="px-3 py-2 border border-white text-left whitespace-normal">{training.area_laboral}</td>
                    <td className="px-3 py-2 border border-white text-left whitespace-normal">{training.agregar_informacion}</td>
                    
                    {/* Editar */}
                    <td className="px-2 py-2 border border-white text-center">
                      <button onClick={() => handleEdit(training)} className="text-blue-400 hover:text-blue-600">
                        <FaEdit size={18} />
                      </button>
                    </td>

                    {/* Eliminar */}
                    <td className="px-2 py-2 border border-white text-center">
                      <button onClick={() => openModal(training)} className="text-red-400 hover:text-red-600">
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">No hay entrenamientos disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ModalDeleteInfo isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </div>
  );
};

export default AddInformation;