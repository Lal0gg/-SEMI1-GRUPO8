import React, { useEffect } from 'react';
import PanelDesc from '../components/paneldescription';
import NavBar5 from '../components/navbar5';
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

    const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
    const token = usuarioActual.token;
    const navigate = useNavigate();
    const stars = Array.from({ length: 10 }, (_, i) => i + 1);
    const rating = 4;

    const [selectedRating, setSelectedRating] = useState(null);

    const [capituloNumber, setcapituloNumber] = useState('');

    const [listaCapitulos, setListaCapitulos] = useState([]);

    const [showCrearPopup, setShowCrearPopup] = useState(false); // Estado para el panel emergente "CREAR CAPITULO"
    const [showSubirPopup, setShowSubirPopup] = useState(false); // Estado para el panel emergente "SUBIR CAPITULO"
    const [showListaPopup, setShowListaPopup] = useState(false); // Estado para el panel emergente "LISTA CAPITULOS"

    const [average, setAverage] = useState(0);

    const handleCapituloNumberChange = (e) => {
        setcapituloNumber(e.target.value);
    };

    const onRatingHover = (star) => {
        setSelectedRating(star);
    };

    const onRatingChange = (star) => {
        setSelectedRating(star);
        console.log(`Valor de la clasificación: ${selectedRating}`);
        // Aquí puedes guardar el valor de la clasificación en tu estado o hacer cualquier otra acción necesaria
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
            } else if (error.response.status === 413) {
                alert("No se puede subir la imagen, tamaño excedido")
            }
        });
    }

    const CrearNotaChapter = async () => {
        console.log("Creando nota de capitulo...")
        console.log("ID de la serie: ", id)
        console.log("Nota: ", selectedRating)
        Service.CreateNote(token, parseInt(id), parseInt(selectedRating)).then((res) => {
            console.log("soy el response de login ", res.data)
            alert("Nota enviada")
        }  ).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede crear la nota, datos incorrectos")
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

    const irViewChapterGeneral = () => {
        navigate('/viewchaptergeneral');
    }


    const RedirectionViewChapter = (capitulo) => {
        console.log("Redireccionando a capitulo...")
        console.log("El capitulo es: ", capitulo)
        const capituloActual = {
            capitulo: capitulo,
            idSerie: id
        }
        localStorage.setItem('capituloActual', JSON.stringify(capituloActual));
        irViewChapterGeneral();
    }

    const [isFollowing, setIsFollowing] = useState(false);

    const handleClick = () => {
        setIsFollowing(!isFollowing);
        DarFollow();
        console.log("Estado: ", isFollowing)
    };


    const DarFollow = async () => {
        console.log("Siguiendo...")
        console.log("ID de la serie: ", id)
        Service.FollowSerie(token, parseInt(id)).then((res) => {
            console.log("soy el response de login ", res.data)
            alert("Siguiendo")
        }   ).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede seguir la serie, datos incorrectos")
            }
        });
    }


    const GetNota = async () => {
        console.log("Obteniendo nota...")
        console.log("ID de la serie: ", id)
        Service.GetNoteChapter(parseInt(id)).then((res) => {
            console.log("soy el response de series ", res.data)
            const nota = res.data;
            console.log("Average : ", nota.average);
            setAverage(nota.average);
        }  ).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener la nota, datos incorrectos")
            } else if (error.response.status === 404) {
                alert("No se puede obtener la nota, no existe")
            }
        });
    }


    useEffect(() => { 
        GetNota();
    }, []);


    return (
        <>
            <NavBar5 />
            <div className='relative flex w-full h-screen bg-violet-900'>
                <div className='flex-grow'>
                    <PanelDesc />
                </div>
                <div className='flex justify-center'>

                    <button
                        className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                        style={{ top: '43em', left: '40em' }}
                        onClick={toggleListaPopup}
                    >
                        LISTA CAPITULOS
                    </button>

                    <button
                        className="absolute   cursor-pointer text-white font-bold text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                        style={{ top: '43em', left: '54EM' }}
                        onClick={toggleSubirPopup}
                    >
                        PUNTUACION
                    </button>

                </div>
                {/* Paneles emergentes */}

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
                                                <span onClick={() => RedirectionViewChapter(index)} className="  text-gray-800">{`Capítulo ${index}`}

                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                )}
                {showSubirPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-1 rounded-lg w-96 h-auto">
                            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => closePopup('subir')}>
                                X
                            </button>
                            <h2 className="text-lg font-semibold mb-2 text-center"> PUNTUAME</h2>
                            <br />
                            <div className="flex justify-center">
                                <img src={src} alt={name} className="items-center justify-center w-36 h-auto" />
                            </div>
                            <br />

                            <div className="flex justify-center">
                                {stars.map((star) => (
                                    <button
                                        key={star}
                                        className={`focus:outline-none ${star <= (selectedRating || rating) ? 'text-yellow-500' : 'text-gray-300'
                                            }`}
                                        onClick={() => onRatingChange(star)}
                                        onMouseEnter={() => onRatingHover(star)} // Agrega este evento para el hover
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            className="bi bi-star-fill h-5 w-5"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center text-center justify-center">
                            <div className="text-4xl font-bold text-yellow-400">★</div>
                            <div className="text-xl font-bold ml-2 text-yellow-950">{average}</div>
                            <div className="text-xl font-bold ml-2 text-yellow-950">/{10}</div>
                            </div>
                            <div className="flex justify-center"> {/* Nuevo contenedor para centrar el botón */}
                                <button className="items-center justify-center bg-violet-500 hover:bg-violet-800 text-white font-bold w-36 h-7 rounded mt-2"
                                    onClick={CrearNotaChapter}
                                >
                                    Puntuar
                                </button>
                                <button
                                    title="Add New"
                                    className={`group cursor-pointer outline-none duration-300 ${isFollowing ? 'text-gray-600' : 'text-violet-600'
                                        }`}
                                    onClick={handleClick}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="50px"
                                        height="50px"
                                        viewBox="0 0 24 24"
                                        className={`stroke-violet-400 fill-none group-hover:fill-violet-800 group-active:stroke-violet-200 group-active:fill-violet-600 group-active:duration-0 duration-300 ${isFollowing ? 'text-gray-600' : 'fill-violet-600'
                                            }`}
                                    >
                                        <path
                                            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                            strokeWidth=".5"
                                        />
                                        <path d="M8 12H16" strokeWidth="1.5" />
                                        <path d="M12 16V8" strokeWidth="1.5" />
                                    </svg>
                                </button>

                            </div>
                        </div>
                    </div>

                )}


            </div>

        </>
    )
}
