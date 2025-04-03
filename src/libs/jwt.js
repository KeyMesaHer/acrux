import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export async function createTokenAccess(payload) {
    try {
        if (!TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET no está definido.");
        }

        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                TOKEN_SECRET,
                { expiresIn: "1h" },
                (err, token) => {
                    if (err) return reject(err);
                    resolve(token);
                }
            );
        });

        return token;
    } catch (error) {
        console.error("Error al generar el token:", error);
        throw error;
    }
}
