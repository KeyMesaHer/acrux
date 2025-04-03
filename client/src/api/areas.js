import axios from './axios';

// Obtener todas las áreas
export const getAreas = async () => {
    const response = await axios.get("/areas"); 
    return response.data;
};

// Agregar nueva área laboral
export const newAreaRequest = (area) => axios.post(`/newArea`, area);

// Actualizar un área laboral
export const updateAreaRequest = (id_area, area) => axios.put(`/area/${id_area}`, area);

// Eliminar área laboral
export const deleteAreaRequest = (id_area) => axios.delete(`/area/${id_area}`);     