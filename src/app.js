import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import trainingRoutes from './routes/training.routes.js';
import areaRoutes from './routes/area.routes.js';
import roleRoutes from './routes/roles.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(cookieParser()); // para manejar y acceder de forma más sencilla a las cookies
app.use('/api', authRoutes);
app.use('/api', trainingRoutes);
app.use('/api', areaRoutes);
app.use('/api', roleRoutes);
app.use('/api', chatRoutes);

export default app;