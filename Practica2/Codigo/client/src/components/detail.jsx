import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Service from '../services/Service';
import fotocita4 from '../images/album.png';


export default function Detail() {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [selectedOption3, setSelectedOption3] = useState('');
    // Función para manejar el cambio en la selección
    const handleDropdownChange = (event) => {
        const newValue = event.target.value;
        if (newValue !== selectedOption) {
            setSelectedOption(newValue);
        }
    };
    
    const handleDropdownChange2 = (event) => {
        const newValue = event.target.value;
        if (newValue !== selectedOption2) {
            setSelectedOption2(newValue);
        }
    };
    
    const handleDropdownChange3 = (event) => {
        const newValue = event.target.value;
        if (newValue !== selectedOption3) {
            setSelectedOption3(newValue);
        }
    };
    


    // ====================== para fotos de album =====================
    const navigate = useNavigate();

    const irDetalles = () => {
        navigate('/detalles');
    }


    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const imagenusuario = usuarioActual.profile_picture_url;
    const username = usuarioActual.username;
    const id = usuarioActual.id;
    const [albumName, setalbumName] = useState('');
    const listaAlbums = [];
    const listaFotos = [];
    const listaTraduccion = [];
    const [images, setImages] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [translations, setTranslations] = useState([]);
    const [traduccion, setTraduccion] = useState('');




    useEffect(() => {
        verLista();
        obtenerNameAlbum();
        construirDropdownTranslations(); 
    },);

    const verLista = async () => {
        Service.ObtenerAlbumLista(username)
            .then((res) => {
                console.log("aaaaaaa")
                console.log("ALBUMS OBTENIDOS ;)");
                const data_usuario = res.data.albums;
                listaAlbums.push(data_usuario);
                // Crear un array con solo los nombres de los álbumes
                const albumNames = data_usuario.map((album) => album.album_name);
                // Construir el dropdown con los nombres de los álbumes
                construirDropdown(albumNames);
                data_usuario.forEach((album) => {
                    const albumName = album.album_name;
                    const albumId = album.album_id;
                    console.log(`Nombre del álbum: ${albumName}, ID del álbum: ${albumId}`);
                });
            }).catch((error) => {
                console.log(error);

            });
    }

    const busquedaListaAlbum = async () => {
        const dropdown = document.getElementById("miDropdown");
        const albumName = dropdown.value;
        try {
            const res = await Service.ObtenerAlbumLista(username);
            const lista = res.data.albums;
            console.log("Lista de albums: ", lista);
            // Filtrar la lista de álbumes para encontrar el álbum con el nombre especificado
            const albumEncontrado = lista.find((album) => album.album_name === albumName);
            if (albumEncontrado) {
                console.log("Álbum encontrado: ", albumEncontrado);
                return albumEncontrado; // Retornar el álbum encontrado
            } else {
                console.log("Álbum no encontrado", albumEncontrado);
                return null; // Retornar null si el álbum no se encuentra
            }
        } catch (error) {
            console.log(error);
            throw error; // Lanzar el error para manejarlo en la función que llama a busquedaListaAlbum
        }
    }





    const obtenerFotosAlbum = async () => {
        try {
            const album = await busquedaListaAlbum();
            if (album) {
                const albumId = album.album_id;
                const res = await Service.ObtenerAlbumsFotos(albumId, username);
                const fotos = res.data.photos.map(photo => photo.photo_url);
                setImages(fotos);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerfotoDrop = async (valorSeleccionado) => {
        try {
            const album = await busquedaListaAlbum();
            if (album) {
                const albumId = album.album_id;
                const res = await Service.ObtenerAlbumsFotos(albumId, username);
                const fotos = res.data.photos;

                // Filtrar la foto correspondiente al valor seleccionado en el dropdown
                const fotoSeleccionada = fotos.find(photo => photo.photo_name === valorSeleccionado);

                // Verificar si se encontró la foto
                if (fotoSeleccionada) {
                    setImages([fotoSeleccionada.photo_url]); // Asignar la foto encontrada al estado de imágenes
                } else {
                    console.log("La foto con el nombre seleccionado no fue encontrada.");
                }
            }
        } catch (error) {
            console.log(error);
        }

    };

    const mandarFoto = async () => {
        const dropdown = document.getElementById('miDropdown2');
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const textContent = selectedOption.textContent;
        console.log("ola" + textContent)
        obtenerfotoDrop(textContent);

    }

    //============================================================================
    const construirDropdown = (albumNames) => {
        const dropdown = document.getElementById("miDropdown"); // Reemplaza "miDropdown" con el ID de tu elemento dropdown
        // Limpiar el dropdown antes de agregar nuevas opciones
        dropdown.innerHTML = "";
        // Agregar cada albumName como una opción al dropdown
        albumNames.forEach((albumName) => {
            const option = document.createElement("option");
            option.text = albumName;
            dropdown.add(option);
        });
    };

    // =================================================================================

    const obtenerNameAlbum = async () => {
        try {
            const album = await busquedaListaAlbum();
            if (album) {
                const albumId = album.album_id;
                const res = await Service.ObtenerAlbumsFotos(albumId, username);
                const fotos = res.data.photos.map(photo => photo.photo_name);
                // Agregar los nombres de las fotos a listaFotos
                listaFotos.push(...fotos);

                // Actualizar el dropdown con los nombres de las fotos
                actualizarDropdown();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const actualizarDropdown = () => {
        const dropdown = document.getElementById('miDropdown2');
        // Limpiar el dropdown antes de agregar nuevas opciones
        dropdown.innerHTML = '';

        // Agregar opciones basadas en los nombres de las fotos en listaFotos
        listaFotos.forEach((foto, index) => {
            const option = document.createElement('option');
            option.value = index; // Puedes usar el índice como valor
            option.textContent = foto;
            dropdown.appendChild(option);
        });
    };


// ================= PARA TRADUCCION =================================================================
const obtenerfotoDrop_traduccion = async (valorSeleccionado) => {
    try {
        const album = await busquedaListaAlbum();
        if (album) {
            const albumId = album.album_id;
            const res = await Service.ObtenerAlbumsFotos(albumId, username);
            const fotos = res.data.photos;
            
            // Filtrar la foto correspondiente al valor seleccionado en el dropdown
            const fotoSeleccionada = fotos.find(photo => photo.photo_name === valorSeleccionado);
            const id_foto = fotoSeleccionada.photo_id
            // Verificar si se encontró la foto
            if (fotoSeleccionada) {
                const dataphoto = await Service.PhotoWithDescription(id_foto);
                console.log("waos", dataphoto )
                console.log("traduccion", dataphoto.data.photo_translations)
                setTranslations(dataphoto.data.photo_translations)
                setDescripcion(dataphoto.data.photo_desc)
                } else {
                console.log("La foto con el nombre seleccionado no fue encontrada.");
            }
        }
    } catch (error) {
        console.log(error);
    }

};

const mandarFoto_traduccion = async () => {
    const dropdown = document.getElementById('miDropdown2');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const textContent = selectedOption.textContent;
    console.log("ola" + textContent)
    obtenerfotoDrop_traduccion(textContent);

}

const construirDropdownTranslations = () => {
    const dropdown = document.getElementById("miDropdown3"); // Reemplaza "miDropdown" con el ID de tu elemento dropdown
    //Limpiar el dropdown antes de agregar nuevas opciones
    dropdown.innerHTML = "";
    //Agregar cada albumName como una opción al dropdown
    translations.forEach((translate) => {
        const option = document.createElement("option");
        option.text = translate.lang;
        dropdown.add(option);
    });
};

const traduccioncompleta =() => {
    const dropdown = document.getElementById('miDropdown3');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const textContent = selectedOption.textContent;
    translations.forEach((translate) => {
        if(translate.lang === textContent){
            setTraduccion(translate.text) 
        }
    })

}

// =================================================================


    return (
        <div>

            <div style={{ position: 'absolute', top: '20px', right: '900px' }}>
                <div className="max-w-sm  rounded-3xl   bg-white border dark:border-neutral-600 dark:bg-azulitomorado relative  top-30 " style={{ right: '360px' }}>

                </div>
                <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '400px', right: '350px', width: '250px', height: '30px', backgroundColor: '#a18fff' }}>
                </div>

                <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '408px', right: '350px', width: '250px', height: '30px' }}>
                    <span
                        className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 "
                    ><img
                            src={fotocita4}  // Reemplaza con la ruta de tu imagen
                            alt="Imagen"
                            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
                        />
                    </span>
                </h2>
                <h3 className="text-2xl" style={{ position: 'absolute', top: '412px', right: '440px', }}>
                    Albumes:
                </h3>
                <select value={selectedOption2} onChange={handleDropdownChange2} id="miDropdown" 
                    style={{ position: 'absolute', top: '460px', right: '350px', width: '250px', height: '30px' }} >
                </select>
            </div>
            <button
                type="button"
                onClick={mandarFoto}
                className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
                style={{ position: 'absolute', top: '605px', right: '999px' }}>
                Seleccionar
            </button>





            <div style={{ position: 'absolute', top: '20px', right: '600px' }}>
                <div className="max-w-sm  rounded-3xl   bg-white border dark:border-neutral-600 dark:bg-azulitomorado relative  top-30 " style={{ right: '360px' }}>

                </div>
                <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '400px', right: '350px', width: '250px', height: '30px', backgroundColor: '#a18fff' }}>
                </div>

                <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '408px', right: '350px', width: '250px', height: '30px' }}>
                    <span
                        className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 "
                    ><img
                            src={fotocita4}  // Reemplaza con la ruta de tu imagen
                            alt="Imagen"
                            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
                        />
                    </span>
                </h2>
                <h3 className="text-2xl" style={{ position: 'absolute', top: '412px', right: '440px', }}>
                    Foto:
                </h3>
                <select value={selectedOption} onChange={handleDropdownChange} id="miDropdown2"
                    style={{ position: 'absolute', top: '460px', right: '350px', width: '250px', height: '30px' }} >
                </select>
            </div>









            <div style={{ position: 'absolute', top: '20px', right: '300px' }}>
                <div className="max-w-sm  rounded-3xl   bg-white border dark:border-neutral-600 dark:bg-azulitomorado relative  top-30 " style={{ right: '360px' }}>

                </div>
                <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '400px', right: '350px', width: '250px', height: '30px', backgroundColor: '#a18fff' }}>
                </div>

                <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '408px', right: '350px', width: '250px', height: '30px' }}>
                    <span
                        className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 "
                    ><img
                            src={fotocita4}  // Reemplaza con la ruta de tu imagen
                            alt="Imagen"
                            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
                        />
                    </span>
                </h2>
                <h3 className="text-2xl" style={{ position: 'absolute', top: '412px', right: '440px', }}>
                    Idioma:
                </h3>
                <select value={selectedOption3} onChange={handleDropdownChange3} id="miDropdown3"
                    style={{ position: 'absolute', top: '460px', right: '350px', width: '250px', height: '30px' }} >
                </select>
            </div>

            <button //boton para actualizar
                type="button"
                onClick={obtenerFotosAlbum}
                className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
                style={{ position: 'absolute', top: '605px', right: '1250px' }}>
                Actualizar
            </button>

            
            <button // boton enviar a traducir
                type="button"
                onClick={mandarFoto_traduccion}
                className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
                style={{ position: 'absolute', top: '605px', right: '710px' }}>
                Enviar
            </button>


            <button // boton para traducir literal a cada lenguaje
                type="button"
                onClick={traduccioncompleta}
                className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
                style={{ position: 'absolute', top: '605px', right: '250px' }}>
                Traducir
            </button>


            <div style={{ position: 'absolute', right: '500px', top: '50px' }} >
                <div className='bg-white shadow-md rounded-lg mt-4' style={{ position: 'absolute', right: '-230px', top: '-60px' }}>
                    <h1 className='text-3xl font-semibold'>Descripción</h1>
                </div>
                <span className="max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mx-auto mt-4">
                    {/* Barra de desplazamiento horizontal para las imágenes */}
                    <div className=" flex">
                        {/* Contenedor de las imágenes */}
                        <div className="flex gap-4 p-4" >
                            <textarea 
                            id="descripcion_foto" 
                            style={{ position: 'absolute', height: '200px', width: '400px' }} 
                            readOnly 
                            className="resize-none rounded-xl"
                            value={descripcion}
                            >
                            </textarea>
                        </div>
                    </div>
                </span>
            </div>



            <div style={{ position: 'absolute', right: '500px', top: '340px' }} >
            <div className='bg-white shadow-md rounded-lg mt-4' style={{ position: 'absolute', right: '-230px', top: '-60px' }}>
                    <h1 className='text-3xl font-semibold'>Traducción</h1>
                </div>
                <span className="max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mx-auto mt-4">
                    {/* Barra de desplazamiento horizontal para las imágenes */}
                    <div className=" flex">
                        {/* Contenedor de las imágenes */}
                        <div className="flex gap-4 p-4" >
                            <textarea 
                            id="descripcion_traducida" 
                            style={{ position: 'absolute', height: '200px', width: '400px' }} 
                            readOnly 
                            className="resize-none rounded-xl"
                            value={traduccion}
                            >
                            </textarea>
                        </div>
                    </div>
                </span>
            </div>






            <div style={{ position: 'absolute', right: '600px', top: '50px' }}>
                <div className="max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mx-auto mt-4">
                    {/* Barra de desplazamiento horizontal para las imágenes */}
                    <div className="overflow-x-scroll flex">
                        {/* Contenedor de las imágenes */}
                        <div className="flex gap-4 p-4">
                            {/* Mapear y mostrar las imágenes */}
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    className="w-35 h-72 object-cover rounded-lg shadow-md"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
