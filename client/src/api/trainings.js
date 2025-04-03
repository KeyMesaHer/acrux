import axios from "./axios";

// Obtener entrenamientos de un usuario específico
export const getTrainingsByUserRequest = (id_usuario) => axios.get(`/user/trainings/${id_usuario}`);
// Obtener todos los entrenamientos
export const getAllTrainingsRequest = () => axios.get(`/trainings`);
// Crear nuevo entrenamiento
export const createTrainingRequest = (training) => axios.post(`/newTraining`, training);
// Actualizar entrenamiento
export const updateTrainingRequest = (id_entrenamiento, training) => axios.put(`/training/${id_entrenamiento}`, training);
// Eliminar entrenamiento
export const deleteTrainingRequest = (id_entrenamiento) => axios.delete(`/training/${id_entrenamiento}`);

// Descargar PDF´s
export const downloadTrainingsPDF = async () => {
    try {
        const response = await axios.get("/trainings/report/pdf", { responseType: "blob" });
        console.log("Respuesta completa del backend (PDF):", response);
        return response;
    } catch (error) {
        console.error("Error en la solicitud del PDF:", error.response?.data);
        throw error;
   }
  };

export const downloadTrainingsByAreaPDF = async () => {
    try {
        const response = await axios.get("/trainings/areas/report/pdf", { responseType: "blob" });
        console.log("Respuesta completa del backend (PDF):", response);
        return response;
    } catch (error) {
        console.error("Error en la solicitud del PDF:", error.response?.data);
        throw error;
   }
};
  
// Descargar Excel´s
export const downloadTrainingsEXCEL = async () => {
    try {
        const response = await axios.get("/trainings/report/excel", { responseType: "blob" });
        console.log("Respuesta completa del backend (Excel):", response);
        return response;
    } catch (error) {
        console.error("Error en la solicitud del Excel:", error);
        throw error;
    }
  };

export const downloadTrainingsByAreaEXCEL = async () => {
    try {
        const response = await axios.get("/trainings/areas/report/excel", { responseType: "blob" });
        console.log("Respuesta completa del backend (Excel):", response);
        return response;
    } catch (error) {
        console.error("Error en la solicitud del Excel:", error);
        throw error;
    }
};