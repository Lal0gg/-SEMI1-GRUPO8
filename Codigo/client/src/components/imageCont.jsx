import React, { useState } from 'react';

export default function ImageContent({ onImageUpload }) {
    const [imageBase64, setImageBase64] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            setImageBase64(base64String);
            onImageUpload(base64String);
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
                {imageBase64 ? (
                    <img src={imageBase64} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <p className="text-gray-500">Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
                )}
            </div>
        </div>
    );
}