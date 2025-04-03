import { createAreaLaboral, getAreaLaboral, updateAreaLaboral, deleteAreaLaboral } from "../models/area.model.js";

// Obtener todas las áreas laborales
export const getAllAreas = async (req, res) => {
    try {
        const areas = await getAreaLaboral();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las áreas laborales" });
    }
};

// Nueva área laboral
export const newArea = async (req, res) => {
    try {
        const { area_laboral, descripcion } = req.body;

        // Verificar que no hayan campos vacíos
        if (!area_laboral || !descripcion){
            return res.status(400).json({
                message : "Todos los campos son obligatorios"
            });
        }
        const areaId = await createAreaLaboral({ area_laboral, descripcion });
        res.status(201).json({ message : "Área laboral creada con exito", areaId});
    } catch (error) {
        console.error("Error en newArea(Controller):", error);
        res.status(500).json({ message: 'Error al crear el área laboral', error });
    }
};

// Actualizar área laboral
export const updateArea = async (req, res) => {
    try {
        const { id_area } = req.params; //id del área a editar
        const updated = await updateAreaLaboral(id_area, req.body);

        // Verificar que haya cargado el área
        if (!updated) {
            return res.status(404).json({ message: 'Área no encontrada o no actualizada' });
        }
        res.json({ message: 'Área laboral actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el área laboral', error });
    }
};

// Eliminar áreas laborales 
export const deleteArea = async (req, res) => {
    try {
        const { id_area } = req.params;
        const deleted = await deleteAreaLaboral(id_area);

        // Verificar que haya cargado el área
        if (!deleted) {
            return res.status(404).json({ message: 'Área laboral no encontrada o no eliminada' });
        }
        res.json({ message: 'Área laboral eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el área laboral', error });
    };
};
