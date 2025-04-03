import connection from "../db.js";

// Obtener los entrenamientos creados por el usuario 
export const getTrainingsByUserId = async (id_usuario) => {
    try {
        const [rows] = await connection.execute(`
            SELECT e.id_entrenamiento, e.id_usuario, e.fecha, a.area_laboral, e.agregar_informacion
            FROM entrenamientos e
            JOIN areas_laborales a ON e.area_laboral = a.id_area
            WHERE e.id_usuario = ?
        `, [id_usuario]);
        return rows;  
    } catch (error) {
        console.error('Error al obtener los entrenamientos del usuario', error);
        throw error;
    }
};

// Crear un nuevo entrenamiento 
export const createTraining = async (trainingData) => {
    try {
        const { id_usuario, area_laboral, agregar_informacion } = trainingData;

        // Verificar que los valores no sean undefined 
        if (!id_usuario || !area_laboral || !agregar_informacion) {
            throw new Error("Los valores ingresados no son válidos.");
        }

        const [result] = await connection.execute(
            'INSERT INTO entrenamientos (id_usuario,  area_laboral, agregar_informacion) VALUES (?, ?, ?)',
            [id_usuario, area_laboral, agregar_informacion ]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al crear entrenamiento:', error);
        throw error;
    }
};


// Obtener todos los entrenamientos creados
export const getAllTrainings = async () => {
    try {
        const [rows] = await connection.execute(`
            SELECT e.id_entrenamiento, e.agregar_informacion, 
                   a.area_laboral AS area_laboral, u.nombre AS nombre_usuario 
            FROM entrenamientos e
            LEFT JOIN areas_laborales a ON e.area_laboral = a.id_area
            LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
        `);
        return rows;
    } catch (error) {
        console.error('Error al obtener todos los entrenamientos', error);
        throw error;
    }
};

export const updateTraining = async (id_entrenamiento, trainingData) => {
    try {
        const { agregar_informacion, area_laboral } = trainingData;
        const [result] = await connection.execute(
            'UPDATE entrenamientos SET  area_laboral = ?, agregar_informacion = ? WHERE id_entrenamiento = ?', [area_laboral, agregar_informacion, id_entrenamiento]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar entrenamiento', error);
    }
};

export const deleteTraining = async (id_entrenamiento) => {
    try {
        const [result] = await connection.execute('DELETE FROM entrenamientos WHERE id_entrenamiento = ?', [id_entrenamiento]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar entrenamiento', error);
    }
};
