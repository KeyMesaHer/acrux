import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const requiredAuth = (req, res, next) => {
    try {
        console.log("Cookies en la solicitud:", req.cookies);
        const { token } = req.cookies;
        console.log("Token recibido:", token);

        // Verificar que exista un token
        if (!token) {
            console.log("No se encontró token en cookies.");
            return res.status(401).json({ message: "No token, Authorization Denied" });
        }

        jwt.verify(token, TOKEN_SECRET, (error, user) => {
            if (error) {
                console.error("Token verification error:", error);
                return res.status(403).json({ message: "Invalid or Expired Token" }); // Avisar al frontend
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Error en requiredAuth:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};