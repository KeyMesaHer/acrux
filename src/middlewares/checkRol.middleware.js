export const checkRole = (roleAccess) => (req, res, next) => {
    try {
        if (!req.user || !roleAccess.includes(req.user.rol)) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error en la validación de rol", error: error.message });
    }
};