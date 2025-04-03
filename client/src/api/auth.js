import axios from './axios.js';

// Registrar usuario
export const registerRequest = (user) => 
  axios.post(`/register`, user, {
    headers: {
      "Content-Type": "multipart/form-data" //Permitir multiples formatos de datos
    }
  });

// Login
export const loginRequest = user => axios.post(`/login`, user);

// Verificar Token
export const verifyTokenRequest = () => {
  const token = localStorage.getItem("token"); // Obtener token almacenado
  if (!token) return Promise.reject("No token found");

  return axios.get(`/verify`, {
    headers: {
      Authorization: `Bearer ${token}`, // Agregar el token en la cabecera
    },
  });
}