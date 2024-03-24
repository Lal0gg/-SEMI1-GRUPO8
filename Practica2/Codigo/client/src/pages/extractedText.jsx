import ImageContent  from '../components/imageCont';
import { useState,useEffect } from 'react';
import Service from '../services/Service';
import NavBar from '../components/NavBar'

export default function extractedText() {
    const [imageBase64, setImageBase64] = useState(null);

    const [text, setText] = useState(null);

    const handleImageUpload = (base64String) => {
        setImageBase64(base64String);
    }


    const quitandoSplit = (base64String) => {
        if (base64String === null) {
            console.error('El string base64 es nulo.');
            return null;
        }
        const Splita64 = base64String.split(",");
        return Splita64[1];
    }

  const ImprimirBase64 = () => {
        console.log(quitandoSplit(imageBase64));
  }

  const ExtraerTexto = async () => {
        console.log("Extrayendo texto");
        Service.ExtractText(quitandoSplit(imageBase64))
            .then((res) => {
                console.log("Texto extraido");
                console.log(res.data);
                setText(res.data.message);
            }).catch((error) => {
                console.log(error);
                console.log("Texto no extraido");
            });
    }


    return (
    <>
    <NavBar />
    <div className="flex w-full h-screen scrollbar-hide">
        <div className="'w-full flex items-center  justify-center lg:w-1/2 xdd6 bg-sky-300">
        <ImageContent onImageUpload={handleImageUpload}/>
        </div>
        <div className="'w-full flex items-center  justify-center lg:w-1/2 xdd6 bg-sky-300">
        <div className="max-w-md  mt-20  p-16  bg-white rounded-lg shadow-md ">
        <h1>{text}</h1>
        <button onClick={ExtraerTexto} type="button" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Ver Contenido</button>
        </div>
        </div>
    </div>
    </>
    );
}