// Conexión al backend
import axios from "./axios";

// Ruta para obtener todos los usuarios
export const getUsersRequest = () => axios.get(`/users`);
// 
export const getUserRequest = (id_usuario) => axios.get(`/user/${id_usuario}`);
// Crear nuevo usuario
export const createUserRequest = (user) => axios.post(`/user`, user);
// Actualizar un usuario
export const updateUserRequest = (id_usuario, user) => axios.put(`/user/${id_usuario}`, user, {
    headers: {
      "Content-Type": "multipart/form-data" //Permitir multiples formatos de datos
    }
  });
// Eliminar un usuario
export const deleteUserRequest = (id_usuario) => axios.delete(`/user/${id_usuario}`);

// Descargar PDFs de usuarios
export const downloadUsersPDF = async () => {
  try {
    const response = await axios.get("/users/report/pdf", { responseType: "blob" });
    console.log("Respuesta completa del backend (PDF):", response);
    return response;
  }catch (error) {
    console.error("Error en la solicitud del PDF:", error);
    throw error;
  }
};

export const downloadUsersByRolPDF = async () => {
  try {
    const response = await axios.get("/users/rol/report/pdf", { responseType: "blob" });
    console.log("Respuesta completa del backend (PDF):", response);
    return response;
  }catch (error) {
    console.error("Error en la solicitud del PDF:", error);
    throw error;
   }
  };

// Descargar Excel´s
export const downloadUsersExcelRequest = async () => {
  try {
    const response = await axios.get("/users/report/excel", { responseType: "blob" });
    console.log("Respuesta completa del backend (Excel):", response);
    return response;
  }catch (error) {
    console.error("Error en la solicitud del Excel:", error);
    throw error;
  }
};

export const downloadUsersExcelByRolRequest = async () => {
  try {
    const response = await axios.get("/users/rol/report/excel", { responseType: "blob" });
    console.log("Respuesta completa del backend (Excel):", response);
    return response;
  }catch (error) {
    console.error("Error en la solicitud del Excel:", error);
    throw error;
  }
};