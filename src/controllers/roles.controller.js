import { getRoles } from "../models/roles.model.js";

// Obtener todos los roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await getRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los roles" });
    }
};
