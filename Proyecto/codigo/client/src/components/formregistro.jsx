import React, { useState } from 'react';
import Foto from '../images/reg.jpeg';
import Service from '../services/Service';


export default function FormRegistro() {
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

    const handleSubmit = (e) => {
        e.preventDefault();
    }



    const AddUser = async () => {
        console.log("Agregando usuario...")
        Service.AddUser(formData.username, formData.password,formData.fullName ).then((res) => {
            console.log("soy el response de login ", res.data)
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("Usuario o contraseña incorrecta")
            }
        });

    }


    return (
        <>
            <div className='justify-center items-center '>
                <div className='flex-1 justify-center'>
                    <div className=" px-20 py-20  justify-center bg-white rounded-lg shadow-md">
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
                                <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Email</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su email"
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
                            <button onClick={AddUser} type="button" className="w-full bg-moradito3 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Registrar</button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}
