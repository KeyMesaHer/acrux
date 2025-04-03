import PDFDocument from "pdfkit";
import { getAllUsers } from '../models/user.model.js';
import { getAllTrainings } from "../models/training.model.js";
import * as XLSX from 'xlsx';

// PDF de todos los usuarios
export const getUsersPDF = async (req, res) => {
    try {
        const users = await getAllUsers();
        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_usuarios.pdf");

        // Deshabilitar caché en la respuesta
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        doc.pipe(res);

        doc.fontSize(20).text("Reporte de Usuarios Registrados", { align: "center" });
        doc.moveDown();

        users.forEach(user => {
            doc.fontSize(12).text(`ID: ${user.id_usuario}`);
            doc.text(`Nombre: ${user.nombre}`);
            doc.text(`Cédula: ${user.cedula}`);
            doc.text(`Email: ${user.email}`);
            doc.text(`Cargo: ${user.cargo}`);
            doc.text(`Rol: ${user.rol}`);
            
            const fechaRegistro = user.fecha_registro ? new Date(user.fecha_registro) : null;
            const fechaFormato = fechaRegistro ? fechaRegistro.toISOString().split("T")[0] : "N/A";

            doc.text(`Fecha de Registro: ${fechaFormato}`);
            doc.moveDown();
        });

        console.log("📄 Enviando archivo PDF...");
        doc.end();

    } catch (error) {
        console.error("Error generando el PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el PDF", error: error.message });
        }
    }
};

// Excel por usuarios
export const getusersEXCEL = async (req, res) => {
    try {
        const users = await getAllUsers();
        console.log("Datos obtenidos para Excel:", users);

        const formattedData = users.map(user => ({
            ID: user.id_usuario,
            Nombre: user.nombre,
            Cédula: user.cedula,
            Email: user.email,
            Cargo: user.cargo || "N/A",
            Fecha_de_Registro: user.fecha_registro 
                ? new Date(user.fecha_registro).toISOString().split("T")[0] 
                : "N/A",
            rol: user.rol,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Usuarios");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", 'attachment; filename="reporte-usuarios.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        // Deshabilitar caché en la respuesta
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        console.log("Enviando archivo Excel...");
        res.send(excelBuffer);

    } catch (error) {
        console.error("Error generando el Excel:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el Excel", error: error.message });
        }
    }
};

// PDF por rol de usuarios
export const getUsersByRolPDF = async (req, res) => {
    try {
        const users = await getAllUsers();
        const doc = new PDFDocument({ margin: 30 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_usuarios_rol.pdf");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        doc.pipe(res);
        doc.fontSize(20).text("Reporte de Usuarios Registrados por Rol", { align: "center", underline: true });
        doc.moveDown(2);

        const roles = {
            "1": "Administradores",
            "2": "Empleados"
        };

        Object.keys(roles).forEach(role => {
            const filteredUsers = users.filter(user => user.rol == role);
            if (filteredUsers.length > 0) {
                doc.fontSize(16).fillColor("blue").text(roles[role], { underline: true });
                doc.moveDown();
                
                filteredUsers.forEach(user => {
                    doc.fillColor("black").fontSize(12);
                    doc.text(`ID: ${user.id_usuario}`);
                    doc.text(`Nombre: ${user.nombre}`);
                    doc.text(`Cédula: ${user.cedula}`);
                    doc.text(`Email: ${user.email}`);
                    doc.text(`Cargo: ${user.cargo || "N/A"}`);
                    
                    const fechaRegistro = user.fecha_registro ? new Date(user.fecha_registro) : null;
                    const fechaFormato = fechaRegistro ? fechaRegistro.toISOString().split("T")[0] : "N/A";
                    doc.text(`Fecha de Registro: ${fechaFormato}`);
                    doc.moveDown(1);
                });
                doc.moveDown(1);
            }
        });

        console.log("📄 Enviando archivo PDF por roles...");
        doc.end();

    } catch (error) {
        console.error("Error generando el PDF por roles:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el PDF", error: error.message });
        }
    }
};

// Excel por rol de usuario
export const getUsersByRolEXCEL = async (req, res) => {
    try {
        const users = await getAllUsers();
        console.log("Datos obtenidos para Excel por roles:", users);

        const roles = { "1": "Administrador", "2": "Empleado" };
        let formattedData = [];

        Object.keys(roles).forEach(role => {
            const filteredUsers = users.filter(user => user.rol == role);
            if (filteredUsers.length > 0) {
                formattedData.push({ 
                    "Rol": roles[role], "ID": "", "Nombre": "", "Cédula": "", "Email": "", "Cargo": "", "Fecha_de_Registro": "" 
                });

                filteredUsers.forEach(user => {
                    formattedData.push({
                        ID: user.id_usuario,
                        Nombre: user.nombre,
                        Cédula: user.cedula,
                        Email: user.email,
                        Cargo: user.cargo || "N/A",
                        Fecha_de_Registro: user.fecha_registro 
                            ? new Date(user.fecha_registro).toISOString().split("T")[0] 
                            : "N/A"
                    });
                });

                formattedData.push({ "": "" }); 
            }
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios por Rol");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", 'attachment; filename="reporte-usuarios-roles.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        console.log("Enviando archivo Excel por roles...");
        res.send(excelBuffer);
    } catch (error) {
        console.error("Error generando el Excel por roles:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el Excel", error: error.message });
        }
    }
};

// PDF de los entrenamientos
export const getTrainingsPDF = async (req, res) => {
    try {
        const trainings = await getAllTrainings();
        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_entrenamientos.pdf");

        // Deshabilitar caché en la respuesta
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        doc.pipe(res);

        doc.fontSize(20).text("Reporte de entrenamientos creados", { align: "center" });
        doc.moveDown();

        trainings.forEach(training => {
            doc.fontSize(12).text(`ID: ${training.id_entrenamiento}`);
            doc.text(`Usuario: ${training.nombre_usuario}`);
            doc.text(`Área laboral: ${training.area_laboral}`);
            doc.text(`Información: ${training.agregar_informacion}`);

            
            const fechaRegistro = training.fecha ? new Date(training.fecha) : null;
            const fechaFormato = fechaRegistro ? fechaRegistro.toISOString().split("T")[0] : "N/A";

            doc.text(`Fecha de creación: ${fechaFormato}`);
            doc.moveDown();
        });

        console.log("📄 Enviando archivo PDF...");
        doc.end();

    } catch (error) {
        console.error("Error generando el PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el PDF", error: error.message });
        }
    }
};

// Excel de entrenamientos 
export const getTrainingsEXCEL = async (req, res) => {
    try {
        const trainings = await getAllTrainings();
        console.log("Datos obtenidos para Excel:", trainings);

        const formattedData = trainings.map(training => ({
            ID: training.id_entranmiento,
            Usuario: training.nombre_usuario,
            Área_laboral: training.area_laboral,
            información: training.agregar_información,
            fecha_de_creación: training.fecha 
                ? new Date(training.fecha).toISOString().split("T")[0] 
                : "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Entrenamientos");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", 'attachment; filename="reporte_entrenamientos.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        // Deshabilitar caché en la respuesta
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        console.log("Enviando archivo Excel...");
        res.send(excelBuffer);

    } catch (error) {
        console.error("Error generando el Excel:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el Excel", error: error.message });
        }
    }
}

// PDF de entrenamientos por Área laboral
export const getTrainingsByAreaPDF = async (req, res) => {
    try {
        const trainings = await getAllTrainings();
        const doc = new PDFDocument({ margin: 30 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_entrenamientos_por_area.pdf");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        doc.pipe(res);
        doc.fontSize(20).text("Reporte de Entrenamientos por Área Laboral", { align: "center", underline: true });
        doc.moveDown(2);

        const areas = [...new Set(trainings.map(training => training.area_laboral))]; 
        areas.forEach(area => {
            const filteredTrainings = trainings.filter(training => training.area_laboral === area);
            if (filteredTrainings.length > 0) {
                doc.fontSize(16).fillColor("blue").text(area, { underline: true });
                doc.moveDown();

                filteredTrainings.forEach(training => {
                    doc.fillColor("black").fontSize(12);
                    doc.text(`ID: ${training.id_entrenamiento}`);
                    doc.text(`Usuario: ${training.nombre_usuario}`);
                    doc.text(`Información: ${training.agregar_informacion}`);

                    const fechaRegistro = training.fecha ? new Date(training.fecha) : null;
                    const fechaFormato = fechaRegistro ? fechaRegistro.toISOString().split("T")[0] : "N/A";
                    doc.text(`Fecha de creación: ${fechaFormato}`);
                    doc.moveDown(1);
                });
                doc.moveDown(1);
            }
        });

        console.log("📄 Enviando archivo PDF por área laboral...");
        doc.end();

    } catch (error) {
        console.error("Error generando el PDF por área laboral:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el PDF", error: error.message });
        }
    }
};

// Excel de entrenamientos por área laboral
export const getTrainingsByAreaEXCEL = async (req, res) => {
    try {
        const trainings = await getAllTrainings();
        console.log("Datos obtenidos para Excel por área laboral:", trainings);

        const areas = [...new Set(trainings.map(training => training.area_laboral))]; 
        let formattedData = [];

        areas.forEach(area => {
            const filteredTrainings = trainings.filter(training => training.area_laboral === area);
            if (filteredTrainings.length > 0) {
                formattedData.push({ Área: area, "": "" }); 

                filteredTrainings.forEach(training => {
                    formattedData.push({
                        ID: training.id_entrenamiento,
                        Usuario: training.nombre_usuario,
                        Información: training.agregar_informacion,
                        Fecha_de_Creación: training.fecha 
                            ? new Date(training.fecha).toISOString().split("T")[0] 
                            : "N/A",
                    });
                });
                formattedData.push({ "": "" }); 
            }
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData, { skipHeader: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Entrenamientos por Área");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", 'attachment; filename="reporte_entrenamientos_por_area.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        console.log("Enviando archivo Excel por área laboral...");
        res.send(excelBuffer);
    } catch (error) {
        console.error("Error generando el Excel por área laboral:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error al generar el Excel", error: error.message });
        }
    }
};