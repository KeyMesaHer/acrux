import React, { useEffect, useState } from "react";
import { useTrainings } from "../context/TrainingsContext";
import { FaSearch, FaTrash  } from "react-icons/fa";
import ModalDeleteInfo from "../manners/ModalDeleteInfo";
import Navbar from "../components/Navbar";
import { GrDocumentPdf } from "react-icons/gr";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFiletypePdf } from "react-icons/bs";


const TrainingsPage = () => {
  const { trainings, getAllTrainings, deleteTraining, downloadTrainPDF, downloadTrainExcel, downloadTrainAreaPDF, downloadTrainByAreaExcel} = useTrainings();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
    getAllTrainings();
  }, []);

  const openModal = (training) => {
    setSelectedTraining(training);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTraining(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedTraining) {
      deleteTraining(selectedTraining.id_entrenamiento);
      closeModal();
    }
  };

  // Filtrar entrenamientos según la búsqueda
  const filteredTrainings = trainings.filter((training) =>
    training.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.area_laboral?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.agregar_informacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-[#0170b8]">
      <Navbar></Navbar>
      <div className="container w-full mx-auto px-4 py-8">
        <div className="w-full max-w-full mx-auto">
          <div className="flex justify-between items-center mb-4">
          {/* Dropdown de reportes */}
          <div className="relative inline-block text-left">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-[#0170b8] text-white px-4 py-2 rounded-lg hover:bg-black hover:text-white flex items-center gap-2">
              <BsFiletypePdf className="text-3xl"/>
            </button>
            {dropdownOpen && (
            <div className="absolute mt-2 w-56 bg-black text-white rounded-lg shadow-lg z-10">
              <ul className="py-2">
                <li className="px-4 py-2 font-bold text-white">Entrenamientos</li>
                <li>
                  <button onClick={downloadTrainPDF} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                    <GrDocumentPdf className="mr-2" /> Descargar PDF
                  </button>
                </li>
                <li>
                  <button onClick={downloadTrainExcel} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                    <PiMicrosoftExcelLogoFill className="mr-2" /> Descargar Excel
                  </button>
                </li>
              <hr className="border-gray-300 my-2" />
                <li className="px-4 py-2 font-bold text-white">Áreas laborales</li>
                <li>
                  <button onClick={downloadTrainAreaPDF} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                    <GrDocumentPdf className="mr-2" /> Descargar PDF
                  </button>
                </li>
                <li>
                  <button onClick={downloadTrainByAreaExcel} className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-200 hover:text-black">
                    <PiMicrosoftExcelLogoFill className="mr-2" /> Descargar Excel
                  </button>
                </li>
               </ul>
            </div>
            )}
          </div>
        {/* Barra de búsqueda */}
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 w-6 h-6 text-white" />
            <input type="text" className="lg:w-64 sm:w-46 bg-transparent text-white pl-12 pr-4 py-2 border border-white rounded-full" placeholder="Buscar Información" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTrainings.length === 0 ? (
            <p className="text-gray-300 text-center">No hay entrenamientos disponibles.</p>
          ) : (
            <table className="w-full border-separate border-spacing-0 text-left text-white overflow-hidden border border-white rounded-lg">
              <thead>
                <tr className="text-center">
                  <th className="px-3 py-2 border border-white">Usuario</th>
                  <th className="px-3 py-2 border border-white">Área Laboral</th>
                  <th className="px-3 py-2 border border-white">Información</th>
                  <th className="px-3 py-2 border border-white"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.map((training) => (
                  <tr key={training.id_entrenamiento} className="text-basis leading-5 hover:bg-gray-800 text-left">
                    <td className="px-2 border border-white">{training.nombre_usuario}</td>
                    <td className="px-2 border border-white">{training.area_laboral}</td>
                    <td className="px-3 py-2 border border-white">{training.agregar_informacion}</td>
                    <td className="px-2 lg:px-6 py-2 border border-white text-center">
                      <div className="flex flex-col lg:flex-row justify-center gap-2 lg:gap-6 items-center">
                        <button onClick={() => openModal(training)} className="text-red-400 hover:text-red-600 focus:outline-none">
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
            <ModalDeleteInfo isOpen={modalOpen} onClose={closeModal} onConfirm={handleDeleteConfirm} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingsPage;
