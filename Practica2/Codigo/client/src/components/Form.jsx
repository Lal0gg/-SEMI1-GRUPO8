import { useNavigate } from 'react-router-dom';
import Service from '../services/Service';
import React from 'react';


export default function Form() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    

    const irRegistro = () => {
        navigate('/registro');  
    }

    const irPerfil = () => {
        navigate('/perfil');
    };

    const irFaceId = () => {
        navigate('/faceid');
    }


    const Usuario = (event) => {
        setUsername(event.target.value);
    }

    const Passsword = (event) => {
        setPassword(event.target.value);
    }

    const Loggearse = async () => {
        Service.Login(username, password)
            .then((res) => {
                const dataUsuario = res.data;
                if(dataUsuario.correct === true){
                    console.log("Usuario logeado");
                    ObtenerUsuario();
                    window.alert("Bienvenido " + username)
                    irPerfil();
                }else{
                    console.log("Usuario no logeado");
                    window.alert("Usuario o contraseña incorrectos")
                }
                
            }).catch((error) => {
                console.log(error);
            });
    }

    const ObtenerUsuario = async () => {
        Service.ObtenerDataUsuario(username)
            .then((res) => {
                console.log("Usuario obtenido");
                console.log(res.data);
                const usuario = res.data;
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
            }).catch((error) => {
                console.log(error);
            });
    }



    return (
        <>
            <div className="bg-white px-12 py-20 rounded-3xl border-gray-100">
                <h1 className="text-5xl font-semibold">FaunaDex Login</h1>
                <p className="font-midium text-lg text-gray-500 mt-4">Ingrese sus datos</p>
                <div className="mt-8">
                    <div>
                        <label className="text-lg font-medium">Usuario</label>
                        <input
                            className='w-full border-2 border-gray-300 p-4 rounded-xl mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-500 ease-in-out'
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={Usuario}
                        />
                    </div>
                    <div>
                        <label className="text-lg font-medium">Contraseña</label>
                        <input
                            className='w-full border-2 border-gray-300 p-4 rounded-xl mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-500 ease-in-out'
                            placeholder="Ingrese su password"
                            type="password"
                            value={password}
                            onChange={Passsword}
                        />
                    </div>
                    {/* login by pass */}
                    <div className="mt-8 flex flex-col gap-t-4">
                        <button onClick={Loggearse} className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-blue-400 text-white text-lg font-bold">Ingrese</button>
                    </div>
                    {/* login by face id */}
                    <div className="mt-8 flex flex-col gap-t-4">
                        <button onClick={irFaceId} className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-blue-400 text-white text-lg font-bold">Face id</button>
                    </div>
                    <div className="mt-8 flex justify-center items-center">
                        <p className="font-medium text-base">No tenes cuenta?</p>
                        <button  onClick={irRegistro} className="font-medium text-base text-blue-400 ml-2">Registrate</button>
                    </div>
                </div>
            </div>
        </>
    );
}