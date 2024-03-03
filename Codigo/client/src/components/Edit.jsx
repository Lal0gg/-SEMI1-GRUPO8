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
  const [albumName, setalbumName] = useState('');


  const verLista = async () => {
    Service.ObtenerAlbumLista(username)
      .then((res) => {
        console.log("ALBUMS OBTENIDOS ;)");
        const data_usuario = res.data.albums;

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
      const res = await Service.CrearAlbum(albumName, user_id);
      const data = res.data;
      console.log(data.albums);

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

    <div className="flex items-center justify-center h-full xdd7" >
      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '90px', right: '350px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}>
      </div>
      <h2 className="text-4xl font-medium leading-tight" >

        <img
          src="https://tecdn.b-cdn.net/img/new/standard/city/041.jpg"
          className="max-w-sm rounded border bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
          alt="..." style={{ position: 'absolute', top: '150px', right: '1000px' }} />


        <span
          className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 " style={{ position: 'absolute', top: '95px', right: '350px', width: '350px', height: '30px' }}
        ><img
            src={fotocita3}  // Reemplaza con la ruta de tu imagen
            alt="Imagen"
            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
          /></span>

      </h2>
      <h3 className="text-2xl" style={{ position: 'absolute', top: '95px', right: '440px', }}>
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

      <select id="miDropdown"   
  style={{ position: 'absolute', top: '460px', right: '350px', width: '350px', height: '30px' }} >

      </select>

      <button
        type="button"

        className="inline-block rounded-full bg-neutral-800 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
        style={{ position: 'absolute', top: '400px', right: '450px' }}>
        Eliminar Albúm
      </button>

      <button
        type="button"
        onClick={_CrearAlbum}
        className="inline-block rounded-full bg-neutral-800 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
        style={{ position: 'absolute', top: '280px', right: '650px' }}>
        Agregar
      </button>

      <button
        type="button" onClick={verLista}
        className="inline-block rounded-full bg-neutral-800 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
        style={{ position: 'absolute', top: '280px', right: '450px' }}>
        Modificar
      </button>

      <button
        type="button"
        className="inline-block rounded-full bg-neutral-800 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
        style={{ position: 'absolute', top: '280px', right: '250px' }} onClick={cancelar}>
        Cancelar
      </button>

    </div>
  );
}
