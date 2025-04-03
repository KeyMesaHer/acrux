import dotenv from "dotenv"; 
import express from "express"
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();
import app from "./app.js";
import { connectDB } from "./db.js";

// Obtener la ruta del directorio del módulo 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'uploads')));

const startServer = async () => {
    await connectDB(); 
    app.listen(5505, () => console.log(`Server on PORT 5505`));
};

startServer().catch(error => {
    console.error("Error iniciando el servidor", error);
});
