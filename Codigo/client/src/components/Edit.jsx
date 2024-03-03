import fotocita3 from '../images/nombre_album.png';
import fotocita4 from '../images/triste.png';
import Service from '../services/Service';

import { useState, useEffect } from 'react';


export default function Edit() {
  useEffect(() => {
    verLista();
  },);

  const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
  const username = usuario.username;
  const user_id = usuario.id
  const fotoperfil = usuario.profile_picture_url;
  const [albumName, setalbumName] = useState('');

  const listaAlbums = [];

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

  const eliminarAlbum = async () => {
    try {
      // Llamar a busquedaListaAlbum para obtener el álbum
      const albumEncontrado = await busquedaListaAlbum();
      if (albumEncontrado) {
        console.log("ID del álbum encontrado: ", albumEncontrado.album_id);

        // Utilizar el ID del álbum encontrado para eliminarlo
        await Service.BorrarAlbum(albumEncontrado.album_id);
        console.log("ALBUM ELIMINADO");
        alert("Álbum eliminado correctamente");
      } else {
        console.log("No se encontró el álbum para eliminar.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const editarAlbum = async () => {
    try {
      // Verificar si el nombre del álbum no está vacío o nulo
      if (!albumName) {
        // Si el nombre del álbum está vacío o nulo, muestra una alerta
        alert("Por favor ingresa un nombre para el álbum.");
        return; // Detiene la ejecución de la función
      }
      // Llamar a busquedaListaAlbum para obtener el álbum
      const albumEncontrado = await busquedaListaAlbum();
      if (albumEncontrado) {
        console.log("ID del álbum encontrado: ", albumEncontrado.album_id);

        // Utilizar el ID del álbum encontrado para editar el nombre del álbum
        await Service.EditarAlbum(albumEncontrado.album_id, albumName);
        console.log("ALBUM EDITADO");
        alert("Álbum editado correctamente");
      } else {
        console.log("No se encontró el álbum para editar.");
      }
    } catch (error) {
      console.log(error);
    }
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

  const _CrearAlbum = async () => {
    try {
      // Verificar si el nombre del álbum no está vacío o nulo
      if (!albumName) {
        // Si el nombre del álbum está vacío o nulo, muestra una alerta
        alert("Por favor ingresa un nombre para el álbum.");
        return; // Detiene la ejecución de la función
      }

      // Si el nombre del álbum no está vacío o nulo, procede con la creación
      const res = await Service.CrearAlbum(albumName, user_id);
      const data = res.data;
      console.log(data.albums);
      alert("Álbum creado correctamente");
    } catch (error) {
      console.log(error);
    }
  }

  const _albumName = (event) => {
    setalbumName(event.target.value)
  }

  const cancelar = () => {
    // Borra el contenido del input (albumName)
    setalbumName('');
  }

  return (
    <div className="flex items-center justify-center h-full " >
      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '90px', right: '350px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}>
      </div>
      <h2 className="text-4xl font-medium leading-tight" >
        <img
          src={fotoperfil}
          className="max-w-sm rounded-3xl border  p-1 dark:border-neutral-600 dark:bg-azulitomorado"
          alt="..." style={{ position: 'absolute', top: '150px', right: '1000px' }} />
          <h1 className='text-2xl text-gray-500' style={{ position: 'absolute', top: '355px', right: '1080px' }}>@{username}</h1>
        <span
          className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 " style={{ position: 'absolute', top: '95px', right: '350px', width: '350px', height: '30px' }}
        ><img
            src={fotocita3}  // Reemplaza con la ruta de tu imagen
            alt="Imagen"
            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
          /></span>
      </h2>
      <h3 className="text-2xl" style={{ position: 'absolute', top: '99px', right: '470px', }}>
        Nombre Albúm:
      </h3>
      <input type="text" value={albumName} onChange={_albumName} id="textbox" style={{ position: 'absolute', top: '140px', right: '350px', width: '350px', height: '30px' }} />
      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '400px', right: '350px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}>
      </div>
      <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '408px', right: '350px', width: '350px', height: '30px' }}>
        <span
          className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 "
        ><img
            src={fotocita4}  // Reemplaza con la ruta de tu imagen
            alt="Imagen"
            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
          /></span>
      </h2>
      <h3 className="text-2xl" style={{ position: 'absolute', top: '412px', right: '540px', }}>
        Albumes:
      </h3>
      <select id="miDropdown"
        style={{ position: 'absolute', top: '460px', right: '350px', width: '350px', height: '30px' }} >
      </select>
      <button
        type="button"
        onClick={eliminarAlbum}
        className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
        style={{ position: 'absolute', top: '305px', right: '350px' }}>
        Eliminar Albúm
      </button>
      <button
        type="button"
        onClick={_CrearAlbum}
        className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
        style={{ position: 'absolute', top: '305px', right: '750px' }}>
        Agregar
      </button>
      <button
        type="button" onClick={editarAlbum}
        className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
        style={{ position: 'absolute', top: '305px', right: '550px' }}>
        Modificar
      </button>
      <button
        type="button"
        className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg"
        style={{ position: 'absolute', top: '305px', right: '150px' }} onClick={cancelar}>
        Cancelar
      </button>
    </div>
  );
}
