import { createContext, useContext, useState } from 'react';
import { createUserRequest, getUsersRequest, updateUserRequest, deleteUserRequest, downloadUsersPDF, downloadUsersExcelRequest, downloadUsersByRolPDF, downloadUsersExcelByRolRequest } from '../api/users.js';

const UserContext = createContext();

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};

export function UserProvider({ children }) {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const res = await getUsersRequest();
            setUsers(res.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const createUser = async (user) => {
        try {
            const res = await createUserRequest(user);
            setUsers([...users, res.data]);
        } catch (error) {
            console.error('Error al crear usuario:', error);
        }
    };

    const updateUser = async (id, updatedUser) => {
        try {
            await updateUserRequest(id, updatedUser);
            setUsers(users.map(user => user.id_usuario === id ? { ...user, ...updatedUser } : user));
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await deleteUserRequest(id);
            setUsers(users.filter(user => user.id_usuario !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    const downloadPDF = async () => {
        try {
            const response = await downloadUsersPDF();
            if (!response || !response.data) {
                console.error("La respuesta del PDF está vacía:", response);
                throw new Error("La respuesta está vacía");
            }
      
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte-usuarios.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError(error.message || "Error desconocido");
            console.error("Error al descargar el PDF:", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await downloadUsersExcelRequest();
            if (!response || !response.data) {
                console.error("La respuesta del Excel está vacía:", response);
                throw new Error("La respuesta está vacía");
            }
      
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_usuarios.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError(error.message || "Error desconocido");
            console.error("Error al descargar el Excel:", error);
        }
    };

    const downloadPDFByRol = async () => {
        try {
            const response = await downloadUsersByRolPDF();
            if (!response || !response.data) {
                console.error("La respuesta del PDF está vacía:", response);
                throw new Error("La respuesta está vacía");
            }
      
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte-usuarios_rol.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError(error.message || "Error desconocido");
            console.error("Error al descargar el PDF:", error);
        }
    };

    const downloadExcelByRol = async () => {
        try {
            const response = await downloadUsersExcelByRolRequest();
            if (!response || !response.data) {
                console.error("La respuesta del Excel está vacía:", response);
                throw new Error("La respuesta está vacía");
            }
      
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_usuarios_rol.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError(error.message || "Error desconocido");
            console.error("Error al descargar el Excel:", error);
        }
    };

    return (
        <UserContext.Provider value={{ users, getUsers, createUser, updateUser, deleteUser, downloadPDF, downloadExcel, downloadPDFByRol, downloadExcelByRol }}>
            {children}
        </UserContext.Provider>
    );
}
