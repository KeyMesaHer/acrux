import axios from "./axios";

// Obtener los roles
export const getRoles = async () => {
    const response = await axios.get("/roles"); 
    return response.data;
};
