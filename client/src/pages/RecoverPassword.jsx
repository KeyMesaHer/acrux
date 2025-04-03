import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import robot from '../assets/robot.png';

const RecoverPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRequestRecovery = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            const res = await axios.post("/recover", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Error en el servidor");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#0170b8] text-white">
            <div className="md:w-[48rem] w-[28rem] h-[19rem] bg-black text-white flex items-center gap-6 rounded-2xl shadow-lg p-6 relative">
                <div className="absolute bottom-0 left-1 md:left-4 flex items-end h-4/6 md:h-5/6">
                    <img src={robot} alt="Robot" className="h-6/6 object-cover" />
                </div>
                <div className="flex flex-col items-center ml-40 md:ml-52 w-4/6 justify-end pb-1">
                    <h2 className="md:text-lg text-2xl font-bold text-center"> ¡Vaya, parece que has olvidado tu contraseña! </h2>
                        <p className="text-sm text-gray-300 text-left"> Para recuperarla, ingresa el correo electrónico asociado a su cuenta de Acrux.</p>
                            {message && <p className="text-green-400 text-sm">{message}</p>}
                            {error && <p className="text-red-400 text-sm">{error}</p>}

                <form onSubmit={handleRequestRecovery} className="w-full flex flex-col items-center gap-4 mt-4">
                    <input type="email"placeholder="Ingrese su correo electrónico"value={email}onChange={(e) => setEmail(e.target.value)}className="w-6/6 bg-black text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm px-3 py-2 ml-0 md:ml-10" />
                        <button type="submit"className="w-1/2 bg-gradient-to-r from-black to-sky-500 text-white border border-white font-semibold rounded-xl text-sm py-2 transition duration-300 hover:from-sky-500 hover:to-black">
                            Enviar correo
                        </button>
                    <Link to={'/'}>Volver al inicio de sesión</Link>
                </form>
                </div>
            </div>
        </div>
    );
};

export default RecoverPassword;
