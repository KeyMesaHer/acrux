import connection from '../db.js';

// Crear un nuevo usuario
export const createUser = async (userData) => {
    try {
        const { nombre, cedula, email, password, cargo, rol, foto } = userData;
        const [result] = await connection.execute(
            'INSERT INTO usuarios (nombre, cedula, email, password, cargo, rol, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, cedula, email, password, cargo, rol, foto]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Obtener un usuario por cédula
export const getUserByCedula = async (cedula) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE cedula = ?', [cedula]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener usuario por cédula:', error);
        throw error;
    }
};

// Obtener un usuario por ID 
export const getUserById = async (id_usuario) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener usuario por id_usuario:', error);
        throw error;
    }
};



// Actualizar un usuario
export const updateUser = async (id_usuario, userData) => {
    try {
        const { email, cargo, foto } = userData;
        const [result] = await connection.execute(
            'UPDATE usuarios SET email = ?, cargo = ?, foto = ? WHERE id_usuario = ?',
            [email, cargo, foto, id_usuario]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

// Eliminar un usuario por ID 
export const deleteUser = async (id_usuario) => {
    try {
        await connection.execute('DELETE FROM chats WHERE id_usuario = ?', [id_usuario]);
        await connection.execute('UPDATE entrenamientos SET id_usuario = NULL WHERE id_usuario = ?', [id_usuario]);
        const [result] = await connection.execute('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const [rows] = await connection.execute(`
            SELECT usuarios.*, roles.rol AS rol
            FROM usuarios
            JOIN roles ON usuarios.rol = roles.id_rol
        `);
        return rows;
    } catch (error) {
        console.error('Error al obtener todos los usuarios', error);
        throw error;
    }
};



// Obtener un usuario por email
export const getUserByEmail = async (email) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error;
    }
};


// Actualizar nueva contraseña 
export const updatePassword = async (id_usuario, userData) =>{
    try {
        const {password} = userData;
        const [result] = await connection.execute(
            'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
            [password, id_usuario]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
}