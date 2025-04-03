import React, { useState, useEffect } from 'react';
import { useAreas } from "../context/AreasContext";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Navbar from '../components/Navbar';
import ModalDeleteArea from '../manners/ModalDeleteArea';

const AreasPage = () => {
const { areas, createArea, updateArea, deleteArea } = useAreas();
const [area_laboral, setAreaLaboral] = useState('');
const [descripcion, setDescripcion] = useState('');
const [editId, setEditId] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [modalOpen, setModalOpen] = useState(false);
const [selectedAreaId, setSelectedAreaId] = useState(null);

const handleGuardar = async () => {
  if (!area_laboral.trim() || !descripcion.trim()) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const areaData = { area_laboral, descripcion };
    if (editId) {
      await updateArea(editId, areaData);
      setEditId(null);
    } else {
      await createArea(areaData);
    }
    setAreaLaboral('');
    setDescripcion('');
  };

  const handleEdit = (area) => {
    setAreaLaboral(area.area_laboral);
    setDescripcion(area.descripcion);
    setEditId(area.id_area);
  };

  const handleDelete = (id) => {
    setSelectedAreaId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedAreaId) {
      await deleteArea(selectedAreaId);
    }
    setModalOpen(false);
    setSelectedAreaId(null);
  };

  const filteredAreas = areas.filter(area =>
    area.area_laboral?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
      <Navbar />  
      <main className="p-6">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-start">
          <div className="w-full max-w-lg mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                className="w-full bg-transparent text-white pl-10 pr-4 py-2 border border-white rounded-full"
                placeholder="Buscar Área"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            </div>
            <div className="mb-4 mt-4">
              <label className="text-white font-bold block mb-2">Área Laboral</label>
              <input
                type="text"
                className="w-full bg-white text-black px-4 py-3 rounded-full"
                value={area_laboral}
                onChange={(e) => setAreaLaboral(e.target.value)}
                placeholder="Nombre del área"
              />

            </div>
            <div className="mb-6">
              <label className="text-white font-bold block mb-2">Descripción</label>
              <textarea
                className="w-full bg-white text-black px-4 py-3 rounded-lg"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del área"
              />

            </div>
            <button
              onClick={handleGuardar}
              className="w-full bg-gradient-to-r from-sky-950 to-sky-600 border boder-2 text-white font-semibold py-3 rounded-full hover:scale-105 transition duration-500"
            >
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
          
          <div className="w-full flex justify-start overflow-x-auto">
            <table className="min-w-full text-white border border-white rounded-lg table-fixed">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b border-white text-left">Área laboral</th>
                  <th className="px-3 py-2 border-b border-white text-left">Descripción</th>
                  <th className="px-2 py-2 border-b border-white text-center">Editar</th>
                  <th className="px-2 py-2 border-b border-white text-center">Eliminar</th>
                </tr>
              </thead>

              <tbody>
                {filteredAreas.length > 0 ? (
                  filteredAreas.map((area) => (
                    <tr key={area.id_area}>
                      <td className="px-3 py-2 border border-white text-left">{area.area_laboral}</td>
                      <td className="px-3 py-2 border border-white text-left">{area.descripcion}</td>
                      <td className="px-2 py-2 border border-white text-center">
                        <button onClick={() => handleEdit(area)} className="text-blue-400 hover:text-blue-600">
                          <FaEdit size={18} />
                        </button>
                      </td>
                      <td className="px-2 py-2 border border-white text-center">
                        <button onClick={() => handleDelete(area.id_area)} className="text-red-400 hover:text-red-600">
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">No hay áreas laborales disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Confirmación para Eliminar */}
      <ModalDeleteArea
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AreasPage;