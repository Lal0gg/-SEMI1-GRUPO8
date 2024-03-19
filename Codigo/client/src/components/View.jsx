import { useState, useEffect } from 'react';
import Service from '../services/Service';
import fotocita4 from '../images/album.png';


export default function Prueba() {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const imagenusuario = usuarioActual.profile_picture_url;
  const username = usuarioActual.username;
  const id = usuarioActual.id;
  const [albumName, setalbumName] = useState('');
  const listaAlbums = [];
  const [images, setImages] = useState([]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    verLista();
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
        const res = await Service.ObtenerAlbumsFotos(albumId);
        const fotos = res.data.photos.map(photo => photo.photo_url);
        setImages(fotos);
      }
    } catch (error) {
      console.log(error);
    }
  };


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


  return (
    <div>
      
      <div style={{ position: 'absolute', top: '20px', right: '700px' }}>
      <div className="max-w-sm  rounded-3xl   bg-white border dark:border-neutral-600 dark:bg-azulitomorado relative  top-30 " style={{right:'360px'}}>
        <img
          src={imagenusuario}
          className="w-80 h-80 object-cover rounded-t-3xl p-2"
          alt="..."
        />
      </div>
        <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '400px', right: '350px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}>
        </div>
        
        <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '408px', right: '350px', width: '350px', height: '30px' }}>
          <span
            className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 "
          ><img
              src={fotocita4}  // Reemplaza con la ruta de tu imagen
              alt="Imagen"
              className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
            />
          </span>
        </h2>
        <h3 className="text-2xl" style={{ position: 'absolute', top: '412px', right: '540px', }}>
          Albumes:
        </h3>
        <select id="miDropdown"
          style={{ position: 'absolute', top: '460px', right: '350px', width: '350px', height: '30px' }} >
        </select>
      </div>
      <button
        type="button"
        onClick={obtenerFotosAlbum}
        className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
        style={{ position: 'absolute', top: '605px', right: '1150px' }}>
        Actualizar
      </button>
      <div className='bg-white shadow-md rounded-lg mt-4' style={{ position: 'absolute', right: '870px', top: '100px' }}>
        <h1 className='text-3xl font-semibold'>Albums</h1>
      </div>

      <div style={{ position: 'absolute', right: '90px', top: '150px' }}>
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
};
