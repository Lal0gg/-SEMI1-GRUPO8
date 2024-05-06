import React, { useEffect } from 'react';
import NavBar5 from '../components/navbar5';
import ImagePanel from '../components/panelgeneral';
import Service from '../services/Service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function ViewSeriesPrivate ()  {

const usuario = JSON.parse(localStorage.getItem('usuario'));
const [imagesSeries, setImagesSeries] = useState([]);


const GetSeriesPublic = async () => {

    Service.GetSeries().then((res) => {
        //console.log("soy el response de series ", res.series)
        const series = res.data.series
        console.log("Series: ", series)

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
    GetSeriesPublic();
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