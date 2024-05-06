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
        chapterNumber: '',
        pageNumber: ''        
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

    const serieActual = JSON.parse(localStorage.getItem('serieActual'));
    const name = serieActual.name;
    const desc = serieActual.desc;
    const src = serieActual.src;
    const id = serieActual.id;


    const AddImagetoChapter = async () => {
        console.log("Agregando imagen...")
        console.log("No. Capitulo: ", formData.chapterNumber)
        console.log("Imagen: ", quitandoSplit(imageBase64))
        console.log("No. Pagina: ", formData.pageNumber)
        console.log("id Serie: ", id)
        console.log("Serie: ", name)
        console.log("Descripcion: ", desc)
        Service.UploadPhotoOfCap(parseInt(formData.chapterNumber),quitandoSplit(imageBase64),parseInt(formData.pageNumber),parseInt(id)).then((res) => {
            console.log("soy el response de login ", res.data)
            alert("Imagen subida")
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede subir la imagen, datos incorrectos")
            }else if (error.response.status === 413){
                alert("No se puede subir la imagen, tamaño excedido")
            }
        });
    }


    return (
        <>
            <div className='flex w-full justify-center items-center h-screen bg-white'>
                <div className='flex-1 '>
                    <Imagen onImageUpload={handleImageUpload}/>
                </div>
                <div className='flex-1'>
                    <div className="max-w-md  mt-20  p-16  bg-white rounded-lg shadow-md ">
                        <h2 className="text-2xl font-semibold m0b-4">Crear Serie</h2>
                        <br />
                        <form>
                            <div className="mb-4">
                                <label htmlFor="chapterNumber" className="block text-lg font-medium text-gray-700">No. Capitulo</label>
                                <input
                                    type="text"
                                    id="chapterNumber"
                                    name="chapterNumber"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese el nombre de la serie"
                                    value={formData.chapterNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="pageNumber" className="block text-lg font-medium text-gray-700">No. Pagina</label>
                                <input
                                    type="text"
                                    id="pageNumber"
                                    name="pageNumber"
                                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese su decripcion"
                                    value={formData.pageNumber}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                            <button onClick={AddImagetoChapter} type="button" className="w-full bg-violet-700 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Subir pagina</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}