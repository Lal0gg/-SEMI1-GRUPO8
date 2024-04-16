
import { useNavigate } from 'react-router-dom';
import Service from '../services/Service';

export default function Perfil() {

    const navigate = useNavigate();

    const irEdit = () => {
        navigate('/editar');
    };

    const irView = () => {
        navigate('/ver');
    };


    const irUp = () => {
        navigate('/subir');
    };

    const irExtractedText = () => {
        navigate('/extractedText');
    }

    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) ;
    const usuario = usuarioActual.username;
    const nombre = usuarioActual.name;
    const foto = usuarioActual.profile_picture_url;
    const tags = usuarioActual.tags;

    const verDatos = () => {
        console.log("Hola soy el usuario actual");
        console.log(usuario);
        console.log(nombre);
        console.log(foto);
        console.log(tags);
    }




    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="card  h-5/6 absolute border-2 border-bluebell bg-gradient-to-b from-bluebell from-[12%] via-[12%] via-slate-100 to-70% to-slate-300 shadow-lg rounded-xl w-8/12 flex justify-center items-center text-white">
                <span className="rounded- bg-red-500 px-2 py-[.6em] absolute top-[2px] right-0 border border-white text-[.6em] mr-1 bg-gradient-to-b from-holyhock via-holyhock to-holyhock font-bold"> ╳ </span>
                <span className="rounded-md bg-red-500 px-2 py-[.6em] absolute top-[2px] right-7 border border-white text-[.6em] mr-2 bg-gradient-to-b from-bluebell via-bluebell to-bluebell"> ▣ </span>
                <span className="rounded-md bg-red-500 px-2 py-[.6em] absolute top-[2px] right-14 border border-white text-[.6em] mr-3 bg-gradient-to-b from-bluebell via-bluebell to-bluebell"> — </span>
                <img src={foto} 
                alt="Foto de perfil"
                className="rounded-3xl w-80 h-80  object-cover  left-14 absolute top-1/2 transform -translate-y-1/2" />
                <div className="absolute right-80 top-1/2 transform -translate-y-24">
                    <div className="text-left">
                        <h1 className="text-black text-2xl">{nombre}</h1>
                        <h1 className="text-bluebell text-2xl">@{usuario}</h1>
                        {tags.map((tag) => (
                        <h1 key={tag} className="text-gray-500 text-xl">{tag}</h1>
                    ))}
                    </div>
                </div>
                <div className="absolute bottom-4 right-4">
                    <button onClick= {irView} className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Fotos</button>
                    <button onClick= {irUp} className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Subir Foto</button>
                    {/* <button onClick= {irEdit} className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Editar Albumes</button> */}
                    <button onClick= {irExtractedText} className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Extraer Texto</button>
                </div>
            </div>
        </div>
    );
}