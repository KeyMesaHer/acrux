import connection from "../db.js";

export const obtenerDatos = async () => {
    try {
        const [rows] = await connection.execute("SELECT * FROM entrenamientos");
        return rows;
    } catch (error) {
        console.error("Error en la base de datos:", error);
        throw error;
    }
};


export const insertarChat = async (chatData) => {
    try {
        const { id_usuario, pregunta, respuesta } = chatData;

        // Verificar que los valores no sean undefined 
        if (!id_usuario || !pregunta || !respuesta) {
            throw new Error("Los valores ingresados no son válidos.");
        }

        const [result] = await connection.execute(
            'INSERT INTO  chats  (id_usuario,  pregunta, respuesta) VALUES (?, ?, ?)',
            [id_usuario, pregunta, respuesta ]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al crear chat', error);
        throw error;
    }
};


export const getChatByUser = async (id_usuario) => {
    try {
        const [rows] = await connection.execute('SELECT id_chat, id_usuario, pregunta, respuesta, fecha FROM chats WHERE id_usuario = ? ORDER BY fecha DESC',[id_usuario]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los chats del usuario', error);
        throw error;
        
    }

}

export const getChatById = async (id_chat) => {
    try {
        const [rows] = await connection.execute('SELECT id_chat, pregunta, respuesta, fecha FROM chats WHERE id_chat = ?', [id_chat]);
        return rows;
    } catch (error) {
        console.error('Error al obtener Chat', error);
        throw error;
    }
};
