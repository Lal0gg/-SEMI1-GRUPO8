import React, { useState } from 'react';

export default function SelectFoto() {
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
        <div className="max-w-xl mx-auto mt-8 p-6 h bg-white rounded-lg shadow-md">
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
    );
}
