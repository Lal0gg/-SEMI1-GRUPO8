import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Service from '../services/Service';
import Imagen from "../components/imageCont"


export default function FormSubirFotoPrivate() {

    const [imageBase64, setImageBase64] = useState(null);

    const handleImageUpload = (base64String) => {
        setImageBase64(base64String);
    }


    const [formData, setFormData] = useState({
        namee: '',
        descrip: ''        
    });
    
    const quitandoSplit = (base64String) => {
        const Splita64= base64String.split(",");
        return Splita64[1];
    }


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
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));



    //este metodo lo hice para que agregue series de un usuario especifico
    //por eso cuando se logea mando a llamar el usuario del localstorage para obtener su token
    //y mandarlo como parametro

    //ahora piter podes usar tdoo este mismo código(me refiero a todo este form literal podes copiar todo este arhivo y e lo pones en oto neuvo del admin) para admin pero, emn vez de mandar usuario token
    //literal no mandas nada y ya se encarga el backend de hacer la validacion que no hay nada y se 
    //volveria un manga/comic publico
    //ejemplo  Service.CreateSerie(quitandoSplit(imageBase64),formData.descrip,formData.namee)
    // y ahi pones lo que sigue del codigo va pero con este codigo pues agregas el comic de forma publica
    // para comprobar todas las que están publica solo usa el getSeries y  gg ezzz bots

    //en todo este documento ya no le tocas nda si queres hacer pruebas crea otro archivo o adaptalo al que ya tenes de admin usano este codigo
    // y haces pruebas todo esto lo mando a llamar a perfilmanga.jsx 

    //y ahora en pageMain ahi podrías mandar a llamar el getSeriesPublics para que te muestre todas las series publicas asi en el orden shido

    // y pues en admin adaptarias todo este mismo codigo pero sin el token del usuario y ya se volveria publico
    const AddSerie = async () => {
        console.log("Agregando serie...")
        console.log("Imagen: ", quitandoSplit(imageBase64))
        console.log("Nombre: ", formData.namee)
        console.log("Descripcion: ", formData.descrip)
        console.log("Token: ", usuario.token)
        Service.CreateSerie(quitandoSplit(imageBase64),formData.descrip,formData.namee,usuario.token).then((res) => {
            console.log("soy el response de login ", res.data)
            alert("Serie registrada")
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede registrar la serie, datos incorrectos")
            }else if (error.response.status === 413){
                alert("No se puede subir la imagen, tamaño excedido")
            }
        });

    }


    //este también sirve para obtener las seriees de unusuario específico
    // por eso se manda como parametro el token del usuario del localstorage
    // entonces muestra las series que tiene ese usuario
    const GetSeriesPriv = async () => {
        console.log("Obteniendo series...")
        console.log("Token: ", usuario.token)
        Service.GetSeriesPrivates(usuario.token).then((res) => {
            console.log("soy el response de series ", res.series)
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener las series, datos incorrectos")
            }
        });
    }



    //este metodo es para obtener todas las series publicas
    const GetSeriesPublics = async () => {
        console.log("Obteniendo series...")
        Service.GetSeries().then((res) => {
            console.log("soy el response de series publics", res.data)
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener las series, datos incorrectos")
            }
        });
    
    }

    return (
        <>
            <div className='flex w-full justify-center items-center h-screen bg-violet-900'>
                <div className='flex-1'>
                    <Imagen onImageUpload={handleImageUpload}/>
                </div>
                <div className='flex-1'>
                    <div className="max-w-md  mt-20  p-16  bg-white rounded-lg shadow-md ">
                        <h2 className="text-2xl font-semibold m0b-4">Crear Serie</h2>
                        <br />
                        <form>
                            <div className="mb-4">
                                <label htmlFor="namee" className="block text-lg font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    id="namee"
                                    name="namee"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese el nombre de la serie"
                                    value={formData.namee}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="descrip" className="block text-lg font-medium text-gray-700">Descripcion</label>
                                <input
                                    type="text"
                                    id="descrip"
                                    name="descrip"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su decripcion"
                                    value={formData.descrip}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                            <button onClick={AddSerie} type="button" className="w-full bg-violet-700 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Registrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}