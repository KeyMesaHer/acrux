import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; 
import logo from '../assets/logoblanco.png';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmited = handleSubmit(async (data) => {
    console.log("Datos enviados:", data);
    const user = await signin(data);
    if (user && user.rol) {
        if (user.rol === "1") {
            navigate("/admin");
        } else if (user.rol === "2") {
            navigate("/employee");
        } else {
            console.error("Rol desconocido:", user.rol);
        }
    } else {
        console.error("Error: No se recibió información del usuario o el rol es undefined.");
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#0170b8] px-4">
      <form onSubmit={onSubmited} className="w-full max-w-md bg-black shadow-md rounded-lg p-8">
        <div className="mb-6 flex justify-center">
          <img className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] object-cover" src={logo} alt="Logo" />
        </div>
          <h2 className="text-2xl mb-3 text-left text-white">INICIAR SESIÓN</h2>

        {signinErrors.map((error, i) => (
          <div className="bg-red-500 text-white p-2 my-2 rounded-md text-sm" key={i}> {error} </div>
        ))}

        <div className="mb-3">
          <input type="text" {...register("cedula", { required: true })} id="cedula" className="bg-black border border-white rounded p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cédula"/>
            {errors.cedula && <p className="text-red-500 text-sm mt-1">Cédula es requerida</p>}
        </div>

        <div className="mb-4 relative">
          <input type={showPassword ? "text" : "password"} id="password" {...register("password", { required: true })} className="bg-black border border-white rounded p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" placeholder="Contraseña"/>
            <button type="button" onClick={togglePasswordVisibility} className="absolute bottom-10 right-5 flex items-center text-white">
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">Contraseña es requerida</p>}
            <Link to='/recoverPassword' className="text-blue-400 text-sm block mt-2 hover:underline">
              ¿Olvidó su contraseña? Recuperar contraseña
            </Link>
        </div>

        <div className="flex justify-center mb-4">
          <button type="submit" className="w-full sm:w-[100px] py-2 bg-gradient-to-b from-black to-[#0170b8] text-white rounded-full border border-white">
            Iniciar
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
