import fotocita from '../images/cambiar_name.png';
import fotocita2 from '../images/album.png';
import  { useState } from 'react';


export default function Up() {
  const [image, setImage] = useState(null);

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



  return (


    <div className="flex items-center justify-center h-full">
      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '190px', right: '450px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}>
      </div>
      <h2 className="text-4xl font-medium leading-tight" >

      <div className="max-w-xl mx-auto mt-8 p-6 h bg-white rounded-lg shadow-md" style={{ position: 'absolute', top: '140px', right: '1000px', width: '350px', height: '450px'}}>
            <label className="block text-lg font-semibold text-gray-700 mb-4">Subir Imagen</label>
            <div className="flex items-center justify-center w-full h-auto border-4 border-dashed border-gray-200 rounded-lg relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute w-full h-full opacity-0"
                />
                {image ? (
                    <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <p className="text-gray-500">Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
                )}
            </div>
        </div>


        <span
          className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 " style={{ position: 'absolute', top: '200px', right: '450px', width: '350px', height: '30px' }}
        ><img
            src={fotocita}  // Reemplaza con la ruta de tu imagen
            alt="Imagen"
            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
          /></span>
        <h3 style={{ position: 'absolute', top: '200px', right: '520px' }}>
          Nombre Foto
        </h3>

      </h2>

      <input type="text" id="textbox" style={{ position: 'absolute', top: '250px', right: '450px', width: '350px', height: '30px' }} />


      <div className="bg-white px-20 py-20 rounded-3xl border-gray-100" style={{ position: 'absolute', top: '355px', right: '450px', width: '350px', height: '30px', backgroundColor: '#a18fff' }}>
      </div>
      <h2 className="text-4xl font-medium leading-tight" style={{ position: 'absolute', top: '350px', right: '400px', width: '350px', height: '30px' }}>
        <span
          className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 "
        ><img
            src={fotocita2}  // Reemplaza con la ruta de tu imagen
            alt="Imagen"
            className="w-6 h-6 mr-2"  // Ajusta el tamaño de la imagen según tus necesidades
          /></span>
        Albúm
      </h2>

      <select id="dropdown" style={{ position: 'absolute', top: '400px', right: '450px', width: '350px', height: '30px' }}>
    <option value="opcion1">Fotos de perfil</option>
    <option value="opcion2">Opción 2</option>
    <option value="opcion3">Opción 3</option>
</select>


      <button
        type="button"
        className="inline-block rounded-full bg-neutral-800 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
        style={{ position: 'absolute', top: '250px', right: '160px' }}>
        Cargar
      </button>


      <button
        type="button"
        className="inline-block rounded-full bg-neutral-800 px-8 pb-3 pt-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
        style={{ position: 'absolute', top: '350px', right: '140px' }}>
        Crear Albúm
      </button>

    </div>
  );
}
