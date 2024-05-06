import React from 'react';

export default function ListSeriesPriv() {
    const capitulos = [
        { id: 1, titulo: "Capítulo 1", numero: 1 },
        { id: 2, titulo: "Capítulo 2", numero: 2 },
        { id: 3, titulo: "Capítulo 3", numero: 3 },
        { id: 4, titulo: "Capítulo 4", numero: 4 },
        // Agrega más capítulos según sea necesario
    ];
    return (
        <div className="relative max-w-md mx-auto mt-10 -mb-64"> {/* Agrega una clase de margen mb-10 para mover hacia abajo */}
            <h2 className="text-2xl font-semibold mb-4">Lista de Capítulos</h2>
            <ul className="divide-y divide-gray-300">
                {capitulos.map((capitulo) => (
                    <li key={capitulo.id} className="py-2">
                        <a
                            href={`#${capitulo.id}`}
                            className="block hover:bg-gray-100 px-4 py-2 rounded-md transition duration-300"
                        >
                            <span className="text-gray-800">{`Capítulo ${capitulo.numero}`}</span>
                            <span className="ml-2 text-gray-500">{capitulo.titulo}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
