import { createContext, useContext, useState } from "react";
import { getTrainingsByUserRequest, getAllTrainingsRequest, createTrainingRequest, updateTrainingRequest, deleteTrainingRequest, downloadTrainingsPDF, downloadTrainingsEXCEL, downloadTrainingsByAreaPDF, downloadTrainingsByAreaEXCEL } from '../api/trainings.js';

const TrainingContext = createContext();

export const useTrainings = () => {
    const context = useContext(TrainingContext);
    if (!context) {
        throw new Error('useTrainings must be used within a TrainingProvider');
    }
    return context;
};

export function TrainingProvider({ children }) {
    const [trainings, setTrainings] = useState([]);
    const [areaLaboral, setAreaLaboral] = useState('');
    const [informacion, setInformacion] = useState('');
    const [registros, setRegistros] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState(null);
    // Obtener todos los entrenamientos
    const getAllTrainings = async () => {
        try {
            const res = await getAllTrainingsRequest();
            setTrainings(res.data);
        } catch (error) {
            console.error('Error al obtener todos los entrenamientos:', error);
        }
    };

    // Entrenamientos por usuario
    const getTrainingsByUser = async (userId) => {
        try {
            const res = await getTrainingsByUserRequest(userId);
            setTrainings(res.data);
        } catch (error) {
            console.error('Error al obtener entrenamientos por usuario:', error);
        }
    };

    // Nuevo entrenamiento
    const createTraining = async (training) => {
        try {
            console.log("Datos enviados al backend:", training);
            const res = await createTrainingRequest(training);
            console.log("Respuesta del servidor:", res.data); 
            setTrainings([...trainings, res.data]);
        } catch (error) {
            console.error('Error al crear entrenamiento:', error.response?.data || error);
        }
    };
    
    // Actualizar entrenamiento
    const updateTraining = async (id, updatedTraining) => {
        try {
            await updateTrainingRequest(id, updatedTraining);
            setTrainings(trainings.map(training => training.id_entrenamiento === id ? { ...training, ...updatedTraining } : training));
        } catch (error) {
            console.error('Error al actualizar entrenamiento:', error.response?.data || error);
        }
    };

    // Eliminar usuario
    const deleteTraining = async (id) => {
        try {
            await deleteTrainingRequest(id);
            setTrainings(trainings.filter(training => training.id_entrenamiento !== id));
        } catch (error) {
            console.error('Error al eliminar entrenamiento:', error);
        }
    };

    const handleGuardar = () => {
        if (areaLaboral.trim() === '' || informacion.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }
        if (editIndex !== null) {
            const updatedRegistros = [...registros];
            updatedRegistros[editIndex] = { areaLaboral, informacion };
            setRegistros(updatedRegistros);
            setEditIndex(null);
        } else {
            setRegistros([...registros, { area_laboral, informacion }]);
        }
        setAreaLaboral('');
        setInformacion('');
    };

    const handleEdit = (index) => {
        setAreaLaboral(registros[index].areaLaboral);
        setInformacion(registros[index].informacion);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        setRegistros(registros.filter((_, i) => i !== index));
    };

    // Descargar PDF´s 
    const downloadTrainPDF = async () => {
        try {
            const response = await downloadTrainingsPDF();
            if (!response || !response.data) {
                console.error("La respuesta del PDF está vacía:", response);
                throw new Error("La respuesta está vacía");
            }
      
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_entrenamientos.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError(error.message || "Error desconocido");
            console.error("Error al descargar el PDF:", error);
        }
    };
    const downloadTrainAreaPDF = async () => {
        try {
            const response = await downloadTrainingsByAreaPDF();
            if (!response || !response.data) {
                console.error("La respuesta del PDF está vacía:", response);
                throw new Error("La respuesta está vacía");
            }
      
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_entrenamientos_por_area.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError(error.message || "Error desconocido");
            console.error("Error al descargar el PDF:", error);
        }
    };

    // Descargar Excel´s
        const downloadTrainExcel = async () => {
            try {
                const response = await downloadTrainingsEXCEL();
                if (!response || !response.data) {
                    console.error("La respuesta del Excel está vacía:", response);
                    throw new Error("La respuesta está vacía");
                }
          
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "reporte_entrenamientos.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                setError(error.message || "Error desconocido");
                console.error("Error al descargar el Excel:", error);
            }
        };
        const downloadTrainByAreaExcel = async () => {
            try {
                const response = await downloadTrainingsByAreaEXCEL();
                if (!response || !response.data) {
                    console.error("La respuesta del Excel está vacía:", response);
                    throw new Error("La respuesta está vacía");
                }
          
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "reporte_entrenamientos_por_area.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                setError(error.message || "Error desconocido");
                console.error("Error al descargar el Excel:", error);
            }
        };

    return (
        <TrainingContext.Provider value={{ trainings, getAllTrainings, getTrainingsByUser, createTraining, updateTraining, deleteTraining, areaLaboral, setAreaLaboral, informacion, setInformacion, registros, setRegistros, editIndex, setEditIndex, handleGuardar, handleEdit, handleDelete, downloadTrainPDF, downloadTrainExcel, error, setError, downloadTrainAreaPDF, downloadTrainByAreaExcel }}>
            {children}
        </TrainingContext.Provider>
    );
}