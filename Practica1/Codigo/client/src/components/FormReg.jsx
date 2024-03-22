import ImageContent from '../components/imageCont'
import React, { useState } from 'react';
import Service from '../services/Service';
import { useNavigate } from 'react-router-dom';




export default function FormReg() {
    const [imageBase64, setImageBase64] = useState(null);

    
    const irLogin=() => {   
        navigate('/login');
    } 

    const handleImageUpload = (base64String) => {
        setImageBase64(base64String);
    }


    const AddUser = async () => {
        console.log("Agregando usuario");
        Service.CrearUsuario(formData.username, formData.fullName, formData.password, quitandoSplit(imageBase64))
            .then((res) => {
                
                console.log("Usuario creado");
                const nuevoUsuario = {
                    username: formData.username,
                    fullName: formData.fullName,
                    password: formData.password,
                    photo_base64: quitandoSplit(imageBase64),
                }
                localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
                console.log(localStorage.getItem('usuarioActual'))
                window.alert("Usuario creado")
            }).catch((error) => {
                console.log(error);
                console.log("Usuario no creado");
            });
    }
        
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const quitandoSplit = (base64String) => {
        const Splita64= base64String.split(",");
        return Splita64[1];
    }

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


        
    return (
        <>
            <div className='flex w-full justify-center items-center h-screen xdd6'>
                <div className='flex-1'>
                    <ImageContent onImageUpload={handleImageUpload}/>
                </div>
                <div className='flex-1'>
                    <div className="max-w-md  mt-20  p-16  bg-white rounded-lg shadow-md ">
                        <h2 className="text-2xl font-semibold m0b-4">Registro de Perfil</h2>
                        <br />
                        <form>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su usuario"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su nombre"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button onClick={AddUser} type="button" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Registrar</button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}