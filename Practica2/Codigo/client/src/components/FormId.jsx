import { useNavigate } from 'react-router-dom';
import Service from '../services/Service';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function FormId() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [photo, setPhoto] = useState('');
    const webcamRef = useRef(null);

    const irPerfil = () => {
        navigate('/perfil');
    };

    const quitandoSplit = (base64String) => {
        const Splita64= base64String.split(",");
        return Splita64[1];
    };

    const capturePhoto = async () => {
        const photoSrc = webcamRef.current.getScreenshot();
        const base64Photo = await transformImage(photoSrc);
        setPhoto(base64Photo);
        return base64Photo;
    };

    const transformImage = async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Aquí puedes realizar cualquier manipulación adicional en la imagen, como cambiar la calidad o el formato
        const dataUrl = canvas.toDataURL('image/jpeg'); // Cambia el formato según sea necesario
        return dataUrl;
    };



    const LoggearseById = async () => {
        const capturePhotox = await capturePhoto();
        console.log("Foto capturada: ", capturePhotox);
        Loggearse(capturePhotox);
    };

    const Usuario = (event) => {
        setUsername(event.target.value);
    };

    const Loggearse = async (fotox) => {
        console.log("Usuario: ", username);
        console.log("Foto: ",fotox);
        Service.LoginWithPhoto(username, quitandoSplit(fotox))
            .then((res) => {
                const dataUsuario = res.data;
                if (dataUsuario.correct === true) {
                    console.log("Usuario logeado");
                    ObtenerUsuario();
                    window.alert("Bienvenido " + username)
                    irPerfil();
                } else {
                    console.log("Usuario no logeado");
                    window.alert("Usuario No Reconocido")
                }

            }).catch((error) => {
                console.log(error);
            });
    };

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
    };

    return (
        <>
            <div className='flex w-full h-screen scrollbar-hide'>
                <div className='w-full flex items-center  justify-center lg:w-1/2 xdd6 bg-sky-300'>
                    <div className="bg-white px-12 py-48 rounded-3xl border-gray-100">
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
                            <div className="mt-8 flex flex-col gap-t-4">
                                <button onClick={LoggearseById} className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-blue-400 text-white text-lg font-bold">Ingrese</button>
                            </div>  
                            </div>
                    </div>
                </div>
                <div className='hidden relative lg:flex h-full items-center w-1/2 justify-center xdd6 bg-sky-300'>
                    <div className="relative max-w-full max-h-full">
                        <div className="bg-white px-12 py-16 rounded-3xl border-gray-100">
                            {photo ? (
                                <img src={photo} alt="Captured" className="mt-4 rounded-lg shadow-md" />
                            ) : (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    className="relative right-0 top-0 w-full h-full rounded-3xl"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
