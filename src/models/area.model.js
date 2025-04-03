import connection from "../db.js";

// Crear Área
export const createAreaLaboral = async (areaData) => {
    try {
        const {area_laboral, descripcion} = areaData;

        // Verificar que los valores no sean undefined 
        if (!area_laboral || !descripcion) {
            throw new Error("Los valores proporcionados no son válidos.");
        }
        const [result] = await connection.execute(
            'INSERT INTO areas_laborales (area_laboral, descripcion) VALUES (?, ?)',
            [area_laboral, descripcion]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error al crear área laboral:', error);
        throw error;        
    }
};

// Obtener áreas
export const getAreaLaboral = async () => {
    try {
        const [rows] = await connection.execute('SELECT id_area, area_laboral, descripcion from areas_laborales');
        return rows;
    } catch (error) {
        console.error('Error al obtener todas las áreas laborales:', error);
        throw error;
    }

};


// Actulizar áreas
export const updateAreaLaboral = async (id_area, areaData) => {
    try {
        const {area_laboral, descripcion} = areaData;
        const [result] = await connection.execute('UPDATE areas_laborales SET area_laboral = ?, descripcion = ? WHERE id_area = ?',
        [area_laboral, descripcion, id_area]);
    
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar área:', error);
        throw error; 
    };
};


// Eliminar área laboral
export const deleteAreaLaboral = async (id_area) => {
    try {
        const [result] = await connection.execute('DELETE FROM areas_laborales WHERE id_area = ?', [id_area]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};

