import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "../api/axios";
import robot from '../assets/robot.png';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);


      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            const res = await axios.post(`/reset/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000);
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
                    <div className="flex flex-col items-center ml-40 md:ml-60 w-4/6 pb-1">
                        <h2 className="text-lg sm:text-2xl font-bold text-center"> Restablecer Contraseña </h2>
                            <p className="text-sm text-gray-300 text-left"> Ingresa tu nueva contraseña para restablecer el acceso.</p>
                                {message && <p className="text-green-400 text-sm">{message}</p>}
                                {error && <p className="text-red-400 text-sm">{error}</p>}

                        <form onSubmit={handleResetPassword} className="w-full flex flex-col items-center gap-4 mt-4">
                            <input type={showPassword ? "text" : "password"}placeholder="Nueva contraseña"value={password}onChange={(e) => setPassword(e.target.value)}className="w-6/6 bg-black text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm px-3 py-3" />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute right-10 mt-3 flex items-center text-white">
                                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                                <button type="submit" className="w-1/2 bg-gradient-to-r from-black to-sky-500 text-white border border-white font-semibold rounded-xl text-sm py-2 transition duration-300 hover:from-sky-500 hover:to-black">
                                    Restablecer
                                </button>
                            <Link to={'/'}>Volver al inicio de sesión</Link>
                        </form>
                    </div>
            </div>
        </div>
    );
};

export default ResetPassword;
