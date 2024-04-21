import { useNavigate } from 'react-router-dom';
import React from 'react';
import Service from '../services/Service';



export default function FormLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const irRegistro = () => {
        navigate('/registro');
    }


    const Usuario = (event) => {
        setUsername(event.target.value);
    }

    const Passsword = (event) => {
        setPassword(event.target.value);
    }

    const irPageMainSeries = () => {
        navigate('/main');
    }


    const Loggearse = async () => {
        console.log("Loggeandose...")
        Service.Login(username, password).then((res) => {
            console.log("soy el response de login ", res.data)
            const nuevoUsuario = {
                username: username,
                password: password,
                token: res.data.AccessToken
            }
            localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
            alert("Bienvenido " + username)
            irPageMainSeries();
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("Usuario o contraseña incorrecta")
            }
        });
    }




    return (
        <>
            <div className="bg-white px-12 py-20 rounded-3xl border-gray-100">
                <h1 className="text-5xl font-semibold">MangaViewer Login</h1>
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
                        <button onClick={Loggearse} className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-moradito3 text-white text-lg font-bold">Ingrese</button>
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


