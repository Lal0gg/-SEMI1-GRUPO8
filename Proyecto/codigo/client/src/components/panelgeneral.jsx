import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImagenPanel = ({ images }) => {
    const navigate = useNavigate();

    const serieActual = (id,name,desc,src) => {
        console.log("Serie actual: ", id)
        console.log("Nombre: ", name)
        console.log("Descripcion: ", desc)
        console.log("Imagen: ", src)
        const serieActual = JSON.stringify({id: id, name: name, desc: desc, src: src})
        localStorage.setItem('serieActual', serieActual);

    }   


    // hay que editar esta madre
    const irPanelDescriptionPriv =()=>{
        navigate('/viewseriegeneraaaaaal');
    }

    const HandlerPaneld = (id,alt,desc,src) => {
        irPanelDescriptionPriv();
        serieActual(id,alt,desc,src);
    }


    return (
        <>
            <div className='grid grid-cols-3 gap-0'>
                {images.map((image, index) => (
                    console.log(image),
                    <div
                        key={index}
                        className="relative w-full h-full rounded-lg overflow-hidden  transition duration-500 ease-in-out transform hover:scale-90 hover:shadow-lg cursor-pointer"
                        onClick={() => HandlerPaneld(image.id,image.alt,image.desc,image.src)}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full scale-75 mb-[-9.5rem] mr-[-0.5rem] object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                            {image.alt}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ImagenPanel;