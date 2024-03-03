import { useState } from 'react';
import Service from '../services/Service';
import fotocita4 from '../images/album.png';


export default function Prueba() {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const imagenusuario = usuarioActual.profile_picture_url;
  const username = usuarioActual.username;
  const id = usuarioActual.id;


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


  return (
    
   <div> <img
   src={imagenusuario}
   className="max-w-sm rounded-3xl border  p-1 dark:border-neutral-600 dark:bg-azulitomorado"
   alt="..." style={{ position: 'absolute', top: '170px', right: '1095px' }} 
   />
<div style={{ position: 'absolute', top: '0', right: '700px' }}>
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
</div></div>
    

);
};
