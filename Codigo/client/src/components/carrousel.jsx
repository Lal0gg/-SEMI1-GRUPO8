
import React, { useState } from 'react';
import Footer from '../components/footer';
import Image1 from '../images/1.png';
import Image2 from '../images/2.png';
import Image3 from '../images/3.png';
import Image4 from '../images/4.jpg';
import Image5 from '../images/5.jpg';
import Image6 from '../images/6.png';
import Image7 from '../images/7.jpg';

import '../assets/Patron.css'

const images = [Image1, Image2, Image3, Image4,Image5,Image6,Image7];


export default function PaginaInicio() {
    const [currentImage, setCurrentImage] = useState(0);

    const prevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex items-center justify-center min-h-screen xdd2">
            <div className="absolute w-full h-full  max-lg: overflow-hidden">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                            index === currentImage ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ filter: 'opacity(0.8)' }}
                    />
                ))}
                <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent text-gray-300 rounded-full p-2 transition duration-300 hover:bg-gray-700 hover:text-white" onClick={prevImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent text-gray-300 rounded-full p-2 transition duration-300 hover:bg-gray-700 hover:text-white" onClick={nextImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                   
            </div>
            
            
        </div>
        
    );

}