import React, { useState, useEffect } from 'react';

export default function SelectFoto({ onImageChange }) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuarioActual && usuarioActual.profile_picture_url) {
            setImage(usuarioActual.profile_picture_url);
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Image = reader.result;
            setImage(base64Image);
            onImageChange(base64Image); // Llama a la función proporcionada con la base64 de la imagen
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Image = reader.result;
            setImage(base64Image);
            onImageChange(base64Image); // Llama a la función proporcionada con la base64 de la imagen
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 h bg-white rounded-lg shadow-md">
            <label className="block text-lg font-semibold text-gray-700 mb-4">Subir Imagen</label>
            <div 
                className="flex items-center justify-center w-full h-auto border-4 border-dashed border-gray-200 rounded-lg relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
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
    );
}
