import fotocita from '../images/cambiar_name.png';
import fotocita2 from '../images/album.png';
import { useState, useEffect } from 'react';
import Service from '../services/Service';
import { useNavigate } from 'react-router-dom';

export default function Up() {


  const [image, setImage] = useState(null);
  const [albumList, setAlbumList] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [photoName, setPhotoName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    verListaAlbums();
  }, []);

  const irCrearAlbum = () => {
    navigate('/editar');
  }

  const verListaAlbums = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    const username = usuario.username;
    try {
      const res = await Service.ObtenerAlbumLista(username);
      setAlbumList(res.data.albums);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAlbumChange = (e) => {
    setSelectedAlbum(e.target.value);
  };

  const handlePhotoNameChange = (e) => {
    setPhotoName(e.target.value);
  };

  const handleUploadPhoto = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
      const user_id = usuario.id;

      const base64Image = image.split(',')[1];
      await Service.SubirFoto(photoName, base64Image, selectedAlbum);
      console.log('Foto subida exitosamente');
      alert('Foto subida exitosamente');
    } catch (error) {
      console.log(error);
      alert('Hubo un error al subir la foto');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '190px', right: '450px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}></div>
      <h2 className="text-4xl font-medium leading-tight">
        <div className="max-w-96 mx-auto mt-10 p-6  bg-white rounded-lg shadow-md" style={{ marginRight: '800px' }}>
          <label className="block text-lg font-semibold text-gray-700 mb-4">Subir Imagen</label>
          <div className="flex items-center justify-center w-full h-auto border-4 border-dashed border-gray-200 rounded-lg relative" >
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute w-full h-full opacity-0" />
            {image ? (
              <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <p className="text-gray-500">Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
            )}
          </div>
        </div>
        <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 " style={{ position: 'absolute', top: '200px', right: '450px', width: '350px', height: '30px' }}>
          <img src={fotocita} alt="Imagen" className="w-6 h-6 mr-2" />
        </span>
      </h2>
      <h3 className='text-2xl font-semibold m-0b-4' style={{ position: 'absolute', top: '200px', right: '600px' }}>Nombre Foto</h3>
      <input type="text" value={photoName} onChange={handlePhotoNameChange} style={{ position: 'absolute', top: '250px', right: '450px', width: '350px', height: '30px' }} />
      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '355px', right: '450px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}></div>
      <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '355px', right: '450px', width: '350px', height: '30px' }}>
        <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 ">
          <img src={fotocita2} alt="Imagen" className="w-6 h-6 mr-2" />
        </span>
      </h2>
      <h3 className='text-2xl font-semibold m-0b-4' style={{ position: 'absolute', top: '360px', right: '675px' }}>Álbum</h3>
      <select id="dropdown" onChange={handleAlbumChange} value={selectedAlbum} style={{ position: 'absolute', top: '400px', right: '450px', width: '350px', height: '30px' }}>
        <option value="">Seleccionar Álbum</option>
        {albumList.map((album) => (
          <option key={album.album_id} value={album.album_id}>{album.album_name}</option>
        ))}
      </select>
      <button type="button" onClick={handleUploadPhoto} className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg" style={{ position: 'absolute', top: '250px', right: '160px' }}>Cargar</button>
      <button type="button" onClick={irCrearAlbum} className="inline-block rounded-full bg-purple-600 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg dark:bg-purple-800 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-purple-800 dark:hover:shadow-lg dark:focus:bg-purple-800 dark:focus:shadow-lg dark:active:bg-purple-900 dark:active:shadow-lg" style={{ position: 'absolute', top: '350px', right: '140px' }}>Crear Álbum</button>
    </div>
  );
}
