import { createUser, getUserById, getUserByCedula, getAllUsers, updateUser, deleteUser, getUserByEmail, updatePassword } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import { createTokenAccess } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar el correo de bienvenida
const emailNoti = async (email, nombre) => {
    try {
        const info = await transporter.sendMail({
            from: '"Centro de Conocimiento Empresarial Acrux" <acruxsoftware2025@gmail.com>',
            to: email,
            subject: 'Bienvenido al Centro de Conocimiento Empresarial Acrux',
            html: `
                <h2>Hola, ${nombre}</h2>
                <p>Bienvenido a nuestra plataforma. Nuestro propósito es gestionar y compartir conocimientos dentro de la empresa</p>
                <p>Si recibiste este correo tu administrador te ha registrado y ahora podrás disfrutar de todas nuestras funciones</p>
                <p>Tus credenciales de acceso son:</p>
                    <ul>
                        <li>Usuario: Número de cédula</li>
                        <li>Contraseña: Tú número de cédula y tu nombre con mayúscula inicial, sin espacios</li>
                    </ul>
                <p>Ejemplo:</p>
                    <ul>
                        <li>Usuario: 123456789</li>
                        <li>Contraseña: 123456789Nombre</li>
                    </ul>
                <p>Puedes acceder a la página en el siguiente enlace:</p>
                <a href="http://localhost:5173/">Ir a la página</a>
                <br>
                <p>Atentamente,</p>
                <p>Centro de Conocimiento Empresarial Acrux</p>
            `
        });
        console.log('Correo enviado: ', info.messageId);
    } catch (error) {
        console.error('Error enviando el correo:', error);
    }
};

// Registrar usuario
export const register = async (req, res) => {
    const { nombre, cedula, email, password, cargo, rol, foto } = req.body;

    // Verificar que la foto no esté vacía
    if (!req.file) {
        return res.status(400).json({ error: 'Debe subir una imagen' });
    }
    
    // Crear URL de la foto
    const fotoUrl = `http://localhost:5505/${req.file.filename}`;

    try {
        const userFound = await getUserByCedula(cedula);
        if (userFound) return res.status(400).json({ errors: ["La cédula ya está registrada"] });

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        // Verificar que no haya campos vacío
        if (!nombre || !cedula || !email || !password || !cargo || !rol || !req.file) {
            return res.status(400).json({ errors: 'Todos los campos son requeridos, incluyendo la foto' });
        }

        const newUserId = await createUser({
            nombre,
            cedula,
            email,
            password: passwordHash,
            cargo,
            rol,
            foto: fotoUrl
        });

        // Enviar el correo de bienvenida
        await emailNoti (email, nombre);

        res.status(201).json({
            id_usuario: newUserId,
            nombre,
            cedula,
            foto: fotoUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Iniciar sesión
export const login = async (req, res) => {
    const { cedula, password } = req.body;

    // Verificar que no haya campos vacíos
    if (!cedula || !password) {
        return res.status(400).json({ message: "Cédula y contraseña son requeridas" });
    }

    try {
        // Encontrar el usuario por su cédula 
        const userFound = await getUserByCedula(cedula);
        if (!userFound) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verificar que la contraseña ingresada coincida con la registrada
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        // Crear token de acceso
        const token = await createTokenAccess({
            id_usuario: userFound.id_usuario,
            rol: userFound.rol  
        });
        
        // Configuración de la cookie
        res.cookie("token", token, {
            httpOnly: true, 
            secure: false, 
            sameSite: "Strict", 
            maxAge: 3600000 
        });

        return res.status(200).json({
            id_usuario: userFound.id_usuario,
            nombre: userFound.nombre,
            cedula: userFound.cedula,
            rol: userFound.rol,
            foto: userFound.foto
        });

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Cerrar sesión
export const logout = (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    return res.sendStatus(200);
};

// Obtener perfil del usuario autenticado
export const profile = async (req, res) => {
    try {
        const userFound = await getUserById(req.user.id_usuario);
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        res.status(200).json({
            id_usuario: userFound.id_usuario,
            nombre: userFound.nombre,
            cedula: userFound.cedula
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verificar token del usuario
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    // Verificar la existencia del token
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.status(401).json({ message: "No autorizado" });

        const userFound = await getUserById(user.id_usuario);
        if (!userFound) return res.status(401).json({ message: "No autorizado" });

        return res.json({
            id_usuario: userFound.id_usuario,
            nombre: userFound.nombre,
            cedula: userFound.cedula
        });
    });
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } 
    catch (error) {
        console.error("Error details:", error);  
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
    
};

// Actualizar usuario
export const updateUserById = async (req, res) => {
    const { id_usuario } = req.params;
    const { email, cargo } = req.body;

    try {
        // Obtener y actualizar el id del usuario a editar
        const userFound = await getUserById(id_usuario);
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        // Si el usuario subió una nueva foto, actualizamos la URL
        let fotoUrl = userFound.foto;
        if (req.file) {
            fotoUrl = `http://localhost:5505/${req.file.filename}`;
        }

        const updated = await updateUser(id_usuario, {
            email,
            cargo,
            foto: fotoUrl
        });

        if (!updated) return res.status(400).json({ message: "No se pudo actualizar el usuario" });

        res.status(200).json({ message: "Usuario actualizado correctamente", foto: fotoUrl });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
};


// Eliminar usuario
export const deleteUserById = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Obtener y eliminar el id del usuario
        const deleted = await deleteUser(id_usuario);
        if (!deleted) return res.status(400).json({ message: "No se pudo eliminar el usuario" });

        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
};


// Recuperar contraseña
export const recoverPassword = async (req, res) => {
    const { email } = req.body;

    // Verificar que se haya ingresado un email
    if (!email) {
        return res.status(400).json({ message: "Correo es requerido" });
    }

    try {
        // Encontrar el usuario asociado al email
        const userFound = await getUserByEmail(email);
        if (!userFound) return res.status(404).json({ message: "El correo electrónico no está registrado" });

        // Crear el token de seguridad que expire en 15 minutos
        const token = jwt.sign({ id_usuario: userFound.id_usuario }, process.env.TOKEN_SECRET, { expiresIn: '15m' });
        // Crear link
        const resetLink = `http://localhost:5173/reset-password/${token}`;

        // Configurar transporte de Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, //Correo electrónico 
                pass: process.env.EMAIL_PASS, //Contraseña de aplicación
            },
        });

        // Configuración del email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userFound.email,
            subject: "Recuperación de contraseña",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
                <p>Hola, <strong>${userFound.nombre}</strong></p>
                <p>Hemos recibido una solicitud para restablecer su contraseña. Para continuar, de clic en el siguiente botón:</p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${resetLink}" 
                     style="background: linear-gradient(90deg, black, #0170b8); color: #ffffff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                     Restablecer contraseña
                  </a>
                </div>
                <p>O puede copiar y pegar el siguiente enlace en su navegador:</p>
                <p style="word-wrap: break-word; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${resetLink}</p>
                <p>Este enlace expirará en <strong>15 minutos</strong>.</p>
                <p>Este correo electrónico no debe ser respondido ni reenviado.</p>
                <p>Si usted no solicitó este cambio, puede ignorar este mensaje.</p>
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 20px; color: #888;">CENTRO DE CONOCIMIENTO EMPRESARIAL ACRUX</p>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};


// Restablecer contraseña
export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // Verifica el token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Token decodificado:", decoded);

        // Busca el usuario en la base de datos
        const userFound = await getUserById(decoded.id_usuario);
        console.log("Usuario encontrado:", userFound);

        if (!userFound) {
            return res.status(404).json({ message: "El correo electrónico no está registrado" });
        }

        // Genera el hash de la nueva contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        console.log("Nueva contraseña hash:", passwordHash);

        // Actualiza la contraseña en la base de datos
        const updateResult = await updatePassword(decoded.id_usuario, { password: passwordHash });
        console.log("Resultado de la actualización:", updateResult);

        res.status(200).json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ message: "Error al restablecer la contraseña", error: error.message });
    }
};