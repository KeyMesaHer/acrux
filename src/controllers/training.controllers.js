import { getTrainingsByUserId, createTraining, getAllTrainings, updateTraining, deleteTraining } from '../models/training.model.js';

// Obtener entrenamientos por usuario
export const getTrainingsByUserIdController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const trainings = await getTrainingsByUserId(id_usuario);
        // Verificar que si hayan entrenamientos del usuario 
        if (!trainings) {
            return res.status(404).json({ message: 'No se encontraron entrenamientos para este usuario' });
        }
        res.json(trainings);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los entrenamientos', error });
    }
};

// Obtener todos los entrenamientos
export const getAllTrainingsController = async (req, res) => {
    try {
        const trainings = await getAllTrainings();
        res.json(trainings);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todos los entrenamientos', error });
    }
};

// Crear un nuevo entrenamiento 
export const createTrainingController = async (req, res) => {
    try {
        // Obtener el usuario autenticado
        const id_usuario = req.user?.id_usuario; 

        // Verificar que si haya un usuario logueado
        if (!id_usuario) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const { area_laboral, agregar_informacion } = req.body;
        // Verificar que no hayan campos vacíos
        if (!area_laboral || !agregar_informacion) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Crear el entrenamiento
        const trainingId = await createTraining({ id_usuario, area_laboral, agregar_informacion });

        res.status(201).json({ message: 'Entrenamiento creado con éxito', trainingId });
    } catch (error) {
        console.error("Error en createTrainingController:", error);
        res.status(500).json({ message: 'Error al crear el entrenamiento', error });
    }
};

// Actualizar entrenamientos
export const updateTrainingController = async (req, res) => {
    try {
        const { id_entrenamiento } = req.params;
        const updated = await updateTraining(id_entrenamiento, req.body);
        // Verificar que haya un id de entrenamiento
        if (!updated) {
            return res.status(404).json({ message: 'Entrenamiento no encontrado o no actualizado' });
        }
        res.json({ message: 'Entrenamiento actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el entrenamiento', error });
    }
};

// Eliminar entrenamiento 
export const deleteTrainingController = async (req, res) => {
    try {
        const { id_entrenamiento } = req.params;
        const deleted = await deleteTraining(id_entrenamiento);
        // Obtener el id del entrenamiento
        if (!deleted) {
            return res.status(404).json({ message: 'Entrenamiento no encontrado o no eliminado' });
        }
        res.json({ message: 'Entrenamiento eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el entrenamiento', error });
    }
};
