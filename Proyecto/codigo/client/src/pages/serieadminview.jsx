import React from 'react';
import PanelDesc from '../components/paneldescription';
import NavBar6 from '../components/navbar6';
import { useState } from 'react';
import FormSubirFotoPrivate from '../components/formsubirImagenCapitulopriv';
import Service from '../services/Service';
import { useNavigate } from 'react-router-dom';

export default function SeriePrivateView() {
    const serieActual = localStorage.getItem('serieActual');
    const serieActualParse = JSON.parse(serieActual);
    const name = serieActualParse.name;
    const desc = serieActualParse.desc;
    const src = serieActualParse.src;
    const id = serieActualParse.id;

    const navigate = useNavigate();


    const [capituloNumber, setcapituloNumber] = useState('');

    const [listaCapitulos, setListaCapitulos] = useState([]);

    const [showCrearPopup, setShowCrearPopup] = useState(false); // Estado para el panel emergente "CREAR CAPITULO"
    const [showSubirPopup, setShowSubirPopup] = useState(false); // Estado para el panel emergente "SUBIR CAPITULO"
    const [showListaPopup, setShowListaPopup] = useState(false); // Estado para el panel emergente "LISTA CAPITULOS"



    const handleCapituloNumberChange = (e) => {
        setcapituloNumber(e.target.value);
    };


    const toggleCrearPopup = () => {
        setShowCrearPopup(!showCrearPopup); // Función para alternar la visibilidad del panel emergente "CREAR CAPITULO"
    };

    const toggleSubirPopup = () => {
        setShowSubirPopup(!showSubirPopup); // Función para alternar la visibilidad del panel emergente "SUBIR CAPITULO"
    };

    const toggleListaPopup = () => {
        GetNumberOfChapters();
        setShowListaPopup(!showListaPopup); // Función para alternar la visibilidad del panel emergente "LISTA CAPITULOS"
    };

    const closePopup = (popup) => {
        switch (popup) {
            case 'crear':
                setShowCrearPopup(false);
                break;
            case 'subir':
                setShowSubirPopup(false);
                break;
            case 'lista':
                setShowListaPopup(false);
                break;
            default:
                break;
        }
    };

    const crearCapitulo = async () => {
        console.log("Creando capitulo...")
        console.log("Numero de capitulo: ", capituloNumber)
        console.log("ID de la serie: ", id)
        Service.CreateChapter(parseInt(capituloNumber), parseInt(id)).then((res) => {
            console.log("soy el response de login ", res.data)
            alert("Capitulo creado")
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede crear el capitulo, datos incorrectos")
            }else if (error.response.status === 413){
                alert("No se puede subir la imagen, tamaño excedido")
            }
        });
    }


    const GetNumberOfChapters = async () => {
        console.log("Obteniendo numero de capitulos...")
        console.log("ID de la serie: ", id)
        Service.GetNumOfChapters(parseInt(id)).then((res) => {
            console.log("soy el response de series ", res.data)
            const chapterList = res.data;

            // Obtener el número de capítulos
            const numberOfChapters = chapterList.chapterNumber;
            console.log("Número de capítulos:", numberOfChapters);

            // Obtener la lista de capítulos
            const chapters = chapterList.chapters;
            setListaCapitulos(chapters);
            console.log("Lista de capítulos:", chapters);

            // Si necesitas acceder a cada capítulo individualmente
            chapters.forEach((chapter, index) => {
                console.log(`Capítulo ${index + 1}:`, chapter);
            });
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener el numero de capitulos, datos incorrectos")
            }
        });
    }


    const GetChapter = async () => {
        console.log("Obteniendo capitulo...")
        console.log("ID de la serie: ", id)
        console.log("Numero de capitulo: ", capituloNumber)
        Service.GetChapter(parseInt(id), parseInt(capituloNumber)).then((res) => {
            console.log("soy el response de series ", res.data)
            const chapter = res.data;
            console.log("Capitulo:", chapter);
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener el capitulo, datos incorrectos")
            }
        });

    }

    const irViewChapterPriv = () => {
        navigate('/viewchapterprivate');
    }


    const RedirectionViewChapter = (capitulo)=>{
        console.log("Redireccionando a capitulo...")
        console.log("El capitulo es: ", capitulo)
        const capituloActual ={
            capitulo: capitulo,
            idSerie: id
        }
        localStorage.setItem('capituloActual', JSON.stringify(capituloActual));
        irViewChapterPriv();
    }


    return (
        <>
            <NavBar6 />
            <div className='relative flex w-full h-screen bg-violet-900'>
                <div className='flex-grow'>
                    <PanelDesc />
                </div>
                <div className='flex justify-center'>
                    <button
                        className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                        style={{ top: '45em', left: '50em' }}
                        onClick={toggleCrearPopup}
                    >
                        CREAR CAPITULO
                    </button>
                    <button
                        className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                        style={{ top: '45em', left: '36em' }}
                        onClick={toggleSubirPopup}
                    >
                        SUBIR CAPITULO
                    </button>
                    <button
                        className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                        style={{ top: '45em', left: '65em' }}
                        onClick={toggleListaPopup}

                    >
                        LISTA CAPITULOS
                    </button>

                </div>
                {/* Paneles emergentes */}
                {showCrearPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg w-3/5">
                            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => closePopup('crear')}>
                                X
                            </button>
                            <h2 className="text-lg font-semibold mb-2"> "CREAR CAPITULO"</h2>
                            <div>
                                <label className="text-lg font-medium">No. Capitulo </label>
                                <input
                                    className='w-full border-2 border-gray-300 p-4 rounded-xl mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-500 ease-in-out'
                                    placeholder="Ingrese el numero"
                                    value={capituloNumber}
                                    onChange={handleCapituloNumberChange}
                                />
                                <br />
                                <br />
                                <button
                                    className="bg-violet-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl"
                                    onClick={crearCapitulo}
                                >
                                    Creando Capitulo
                                </button>


                            </div>
                        </div>
                    </div>
                )}
                {showSubirPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-1 rounded-lg w-3/5 h-auto ">
                            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => closePopup('subir')}>
                                X
                            </button>
                            <h2 className="text-lg font-semibold mb-2"> "SUBIR CAPITULO"</h2>
                            <FormSubirFotoPrivate />
                        </div>
                    </div>
                )}
                {showListaPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg">
                            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => closePopup('lista')}>
                                X
                            </button>
                            <h2 className="text-lg font-semibold mb-2">Contenido del panel emergente "LISTA CAPITULOS"</h2>
                            <div className="max-w-md mx-auto mt-10">
                                <h2 className="text-2xl font-semibold mb-4">Lista de Capítulos</h2>
                                <ul className="divide-y divide-gray-300">
                                    {listaCapitulos.map((index) => (
                                        <li key={index} className="py-2">
                                            <div
                                                href={`#${index}`}
                                                className="block  hover:bg-indigo-300 px-4 py-2 rounded-md   transition duration-300"
                                                
                                            >
                                                <span    onClick={() => RedirectionViewChapter(index)}  className= "  text-gray-800">{`Capítulo ${index}`}
                                                
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
