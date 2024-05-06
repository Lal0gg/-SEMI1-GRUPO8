import React from 'react';
import Fotofondo from '../images/fondo.jpg';

export default function PanelDescription() {
    const serieActual = localStorage.getItem('serieActual');
    const serieActualParse = JSON.parse(serieActual);
    const { name: nombre, desc: descripcion, src: imagen } = serieActualParse;

    return (
        <div className={`fixed inset-0 flex items-center justify-center `}>
            <div className="w-5/6 max-w-screen-2xl rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                    <img src={Fotofondo} alt="Fondo" className="absolute inset-0 object-cover w-full h-full rounded-lg opacity-80" />
                    <div className="bg-black absolute inset-0 opacity-90 rounded-lg"></div>
                    <div className="p-8 text-gray-100 relative">
                        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                        </button>
                        <div className="flex items-center mb-6">
                            <img src={imagen} alt={nombre} className="w-44 h-72 rounded-2xl mr-4" />
                            <div>
                                <h2 className="text-4xl font-bold ">{nombre}</h2>
                            </div>
                        </div>
                        <p className="text-gray-100 text-justify">{descripcion}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}