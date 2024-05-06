import React, { useEffect } from 'react';
import NavBar5 from '../components/navbar5';
import ImagePanel from '../components/panelprivado';
import Service from '../services/Service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Foto1 from './img/1.jpg';
import Foto2 from './img/2.jpg';
import Foto3 from './img/3.jpeg';
import Foto4 from './img/4.jpg';
import Foto5 from './img/5.jpg';
import Foto6 from './img/6.jpg';



export default function ViewSeriesPrivate ()  {

const usuario = JSON.parse(localStorage.getItem('usuario'));
const [imagesSeries, setImagesSeries] = useState([]);



const GetSeriesPriv = async () => {
    console.log("Obteniendo series...")
    console.log("Token: ", usuario.token)
    Service.GetSeriesPrivates(usuario.token).then((res) => {
        //console.log("soy el response de series ", res.series)
        const series = res.series

        const imagesArray = Object.keys(series).map(key => ({
            src: series[key].coverUrl,
            alt: series[key].name,
            id: key,
            desc: series[key].description
        }));
        setImagesSeries(imagesArray);

    }).catch((error) => {
        console.error(error);
        if (error.response.status === 500) {
            alert("No se puede obtener las series, datos incorrectos")
        }
    });
}

useEffect(() => {
    GetSeriesPriv();
}, []);



    return (
        <>
        <div className='bg-violet-900'>
        <NavBar5/>
        <br />
        <div className='container mx-auto'>
            <ImagePanel images={imagesSeries}/>
        </div>
            
        </div>
        </>
        
    );
}