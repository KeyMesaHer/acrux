import { createContext, useContext, useState, useEffect } from "react";
import { getAreas, newAreaRequest, updateAreaRequest, deleteAreaRequest } from "../api/areas.js";

const AreaContext = createContext();

export const useAreas = () => {
    const context = useContext(AreaContext);
    if (!context) {
        throw new Error('useAreas must be used within a AreaProvider');
    }
    return context;
};

export function AreaProvider({ children }) {
    const [areas, setAreas] = useState([]);

    // Cargar áreas laborales
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const areasData = await getAreas();
                console.log("Áreas laborales obtenidas:", areasData); 
                setAreas(areasData);
            } catch (error) {
                console.error('Error al cargar áreas', error);
            }
        };
        fetchAreas();
    }, []);
    
    // Crear área laboral
    const createArea = async (area) => {
        try {
            await newAreaRequest(area); //conectar al backend
            const updatedAreas = await getAreas(); //Recargar las áreas
            setAreas(updatedAreas);
        } catch (error) {
            console.error('Error al crear área laboral', error.response?.data || error);
        }
    };
    
    // Actualizar áreas laborales
    const updateArea = async (id, updatedArea) => {
        try {
            await updateAreaRequest(id, updatedArea);
            setAreas(areas.map(area => area.id_area === id ? { ...area, ...updatedArea } : area));
        } catch (error) {
            console.error('Error al actualizar área', error);
        }
    };

    // Eliminar áreas laborales
    const deleteArea = async (id) => {
        try {
            await deleteAreaRequest(id);
            setAreas(areas.filter(area => area.id_area !== id));
        } catch (error) {
            console.error('Error al eliminar área laboral', error);
        }
    };

    return (
        <AreaContext.Provider value={{ areas, createArea, updateArea, deleteArea }}>
            {children}
        </AreaContext.Provider>
    );
}