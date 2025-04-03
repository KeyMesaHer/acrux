import connection from "../db.js";

// Obtener los roles
export const getRoles = async () => {
    try {
        const [rows] = await connection.execute('SELECT id_rol, rol from roles');
        return rows;
    } catch (error) {
        console.error('Error al obtener los roles', error);
        throw error;
    }
}