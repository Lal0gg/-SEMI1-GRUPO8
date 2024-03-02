import SelectFoto from '../components/SelectFoto'
import { useState, useEffect } from 'react';
import Service from '../services/Service';

export default function FormActualizacion() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    const [profilePicture, setProfilePicture] = useState('');

    const [nuevafoto, setNuevafoto] = useState('');



    useEffect(() => {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        console.log(usuarioActual);
        if (usuarioActual) {
            console.log("entro");
            setUsername(usuarioActual.username);
            setFullName(usuarioActual.name);

        }
    }, []);



    const handleImageChange = (base64Image) => {
        setProfilePicture(base64Image);
    };

    const GetUser = async () => {
        Service.ObtenerDataUsuario(username)
            .then((res) => {
                const data = res.data;
                setNuevafoto(data.profile_picture_url);
            }).catch((error) => {
                console.log(error);
            });


    }

    

    const ActualizarUsuario = async () => {
        const new_username = username;
        const new_name = fullName;
        const new_photo_base64 = quitandoSplit(profilePicture);
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        const id = usuario.id;

        try {
            console.log("Actualizando usuario");
            const response = await Service.Actualizarusuario(password, id, new_username, new_name, new_photo_base64);
            console.log("Usuario actualizado");
            GetUser();
            const data = response.data;
            console.log("dataaa: " + data);
            const nuevoUsuario = {
                id: id,
                name: fullName,
                profile_picture_url: nuevafoto,
                username: username,
            }
            localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
        } catch (error) {
            if (error.response && error.response.status === 500 && error.response.data && error.response.data.detail === "Incorrect password") {
                // Si el error es por contraseña incorrecta, muestra una alerta
                alert("¡Contraseña incorrecta! Por favor, ingresa la contraseña correcta.");
            } else {
                // Maneja otros errores de manera predeterminada
                console.log(error);
            }
        }
    };


    const quitandoSplit = (profilePicture) => {
        const Splita64 = profilePicture.split(",");
        return Splita64[1];
    }


    return (
        <>
            <div className='flex w-full justify-center items-center h-screen xdd6'>
                <div className='flex-1'>
                    <SelectFoto onImageChange={handleImageChange} />
                </div>
                <div className='flex-1'>
                    <div className="max-w-md  mt-20  p-16  bg-white rounded-lg shadow-md ">
                        <h2 className="text-2xl font-semibold m0b-4">Actualizar  Perfil</h2>
                        <br />
                        <form>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su usuario"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su nombre"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su contraseña"
                                />
                            </div>
                            <button type="button" onClick={ActualizarUsuario} className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Actualizar</button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}