import fotito from '../images/icon13.jpeg';

export default function Perfil() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="card  h-5/6 absolute border-2 border-bluebell bg-gradient-to-b from-bluebell from-[12%] via-[12%] via-slate-100 to-70% to-slate-300 shadow-lg rounded-xl w-8/12 flex justify-center items-center text-white">
            
                <span className="rounded- bg-red-500 px-2 py-[.6em] absolute top-[2px] right-0 border border-white text-[.6em] mr-1 bg-gradient-to-b from-holyhock via-holyhock to-holyhock font-bold"> ╳ </span>
                <span className="rounded-md bg-red-500 px-2 py-[.6em] absolute top-[2px] right-7 border border-white text-[.6em] mr-2 bg-gradient-to-b from-bluebell via-bluebell to-bluebell"> ▣ </span>
                <span className="rounded-md bg-red-500 px-2 py-[.6em] absolute top-[2px] right-14 border border-white text-[.6em] mr-3 bg-gradient-to-b from-bluebell via-bluebell to-bluebell"> — </span>
                <img src={fotito} 
                alt="Foto de perfil"
                className="rounded-3xl w-80 h-auto object-cover  left-14 absolute top-1/2 transform -translate-y-1/2" />
                <div className="absolute right-28 top-1/2 transform -translate-y-16">
                    <div className="text-left">
                        <h1 className="text-pretty text-black text-2xl">Eduardo Josué Gonzalez Cifuentes</h1>
                        <h1 className="text-pretty text-gray-500 text-2xl">@lal0gg</h1>
                    </div>
                </div>
                <div className="absolute bottom-4 right-4">
                    <button className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Fotos</button>
                    <button className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Subir Foto</button>
                    <button className="bg-bluebell text-white px-4 py-2 rounded-md mr-4">Editar Albumes</button>
                </div>
                 
            </div>
        </div>
    );
}