import React, { useState } from 'react';
import { useEffect } from 'react';
import Service from '../services/Service';
import Card from '../components/cardTranslate';
export default function ViewChapPriv({ images }) {

    const audio = "https://proyecto-semi-g8.s3.us-east-2.amazonaws.com/audios/en-US-Hola.mp3"
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageForTranscription, setCurrentPageForTranscription] = useState(0);
    const [currentImage, setCurrentImage] = useState(images[currentPage]);
    const [transcription, setTranscription] = useState('');
    const [showCrearPopup, setShowCrearPopup] = useState(false); // Estado para el panel emergente "CREAR CAPITULO"
    const [listaTranscripcion, setListaTranscripcion] = useState([]);
    const handleChangePage = (page) => {
        setCurrentPage(page);
        setCurrentPageForTranscription(page);
        setCurrentImage(images[page]);

    };



    const handlePrevious = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
        setCurrentPageForTranscription((prevPage) => Math.max(prevPage - 1, 0));
        setCurrentImage(images[currentPage]);
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, images.length - 1));
        setCurrentPageForTranscription((prevPage) => Math.min(prevPage + 1, images.length - 1));
        setCurrentImage(images[currentPage]);

    };

    const handleAnotherButton = () => {
        // Aquí puedes escribir la lógica que necesites para el nuevo botón
        console.log("¡Se hizo clic en el otro botón!");
        // Por ejemplo, puedes hacer que avance dos páginas en lugar de una
        //Translate();
        GetTranscription();
        xd();
    };

    const GetTranscription = async () => {
        console.log("Obteniendo transcripción...")
        console.log("Imagen: ", currentImage)
        Service.GetTranscript(currentImage).then((res) => {
            //console.log("Transcripcionnnn: ", res.data.lines)
            const listaTranscripcionnn = res.data.lines;
            setListaTranscripcion(listaTranscripcionnn);
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener la transcripción, datos incorrectos")
            }
        });
    }

    const xd = () => {
        console.log(listaTranscripcion)
    }

    const HandlerTranscripcion = (trs) => {
        let nuevtrs = trs.replace(/\s+/g, "").replace(/\./g, "");
        return nuevtrs;
    }

    const HandlerNameAudio = (trs) => {
        let nuevtrs = trs.replace(/\s+/g, "")
        return nuevtrs;
    }

    const Translate = async () => {
        console.log("Traduciendo...")
        const sourceLang = 'en'
        const voiceLang = 'es-ES'
        Service.TraductionYAudio(HandlerTranscripcion(transcription), sourceLang, voiceLang).then((res) => {
            console.log("Traducción: ", res.data)
            const urlaudio = res.data.audioURL;
            console.log("URL Audio: ", HandlerNameAudio(urlaudio))
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener la traducción, datos incorrectos")
            }
        });
    }

    const closePopup = (popup) => {
        switch (popup) {
            case 'crear':
                setShowCrearPopup(false);
                break;
            default:
                break;
        }
    };

    const handleCapituloNumberChange = (e) => {
        setcapituloNumber(e.target.value);
    };


    const toggleCrearPopup = () => {
        setShowCrearPopup(!showCrearPopup); // Función para alternar la visibilidad del panel emergente "CREAR CAPITULO"
    };


    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full px-40">
                <button
                    className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                    style={{ top: '5em', left: '11em' }}
                    onClick={handlePrevious}
                >
                    &lt; Anterior
                </button>
                <button
                    className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                    style={{ top: '5em', left: '34em' }}
                    onClick={toggleCrearPopup}
                >
                    Translate
                </button>
                <select
                    value={currentPage}
                    onChange={(e) => handleChangePage(parseInt(e.target.value))}
                    className="absolute mx-4 cursor-pointer bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] hover:shadow-lg before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700 text-white bg-violet-500 font-medium overflow-hidden shadow-md focus:outline-none w-[9em] h-[3em] text-center"
                    style={{ top: '4em', left: '48em' }}
                >
                    {images.map((_, index) => (
                        <option key={index} value={index}>
                            Página {index + 1}
                        </option>
                    ))}
                </select>
                <button
                    className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                    style={{ top: '5em', left: '85em' }}
                    onClick={handleNext}
                >
                    Siguiente &gt;
                </button>
                <br />
                <br />
            </div>
            <div className="flex items-center justify-center mt-4">
                <img
                    src={images[currentPage]}
                    alt={`Página ${currentPage + 1}`}
                    className="max-w-4xl h-full rounded-lg shadow-2xl"
                />
            </div>
            {showCrearPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-opacity-90 bg-white  p-4 rounded-lg w-3/5">
                        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => closePopup('crear')}>
                            X
                        </button>
                        <h2 className="text-lg font-semibold mb-2"> </h2>
                        <button className="bg-violet-500 text-pink-100 border border-pink-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                onClick={handleAnotherButton}
                        >
                            <span className="bg-pink-400 shadow-pink-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                            Transcripcion
                        </button>
                        < Card  lista={listaTranscripcion} />
                    </div>
                </div>
            )}
        </div>
    );
}
