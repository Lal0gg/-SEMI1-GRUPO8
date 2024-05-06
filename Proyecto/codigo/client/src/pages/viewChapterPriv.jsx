
import React, { useEffect } from 'react'
import { useState } from 'react'
import ViewerChapter from '../components/viewChapPriv'
import Service from '../services/Service'
import NavBar5 from '../components/navbar5'
import foto1 from '../images/1.png'
import foto2 from '../images/2.jpeg'
import foto3 from '../images/3.jpeg'
import foto4 from '../images/4.png'
import foto5 from '../images/5.jpeg'
import foto6 from '../images/6.png'
import foto7 from '../images/7.jpeg'
import NavBar2 from '../components/navbar2'


export default function viewChapPriv() {

    const images = [foto1, foto2, foto3, foto4, foto5, foto6, foto7]
    const [listaImages, setListaImages] = useState([]);

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const seriActual = JSON.parse(localStorage.getItem('serieActual'));

    const capActual = JSON.parse(localStorage.getItem('capituloActual'));
    const capitulo = capActual.capitulo
    const idSerie = capActual.idSerie;

    const GetChapter = async () => {
        console.log("Obteniendo capitulo...")
        console.log("Serie: ", idSerie)
        console.log("Capitulo: ", capitulo)

        Service.GetChapter(parseInt(idSerie), parseInt(capitulo)).then((res) => {
            const ListaImages = res.data.pages;
            ListaImages.sort((a, b) => a.index - b.index);
            const urls = ListaImages.map(image => image.url);
            urls.forEach(url => {
                console.log(url);
            })
            setListaImages(urls);
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener las series, datos incorrectos")
            }
        });
    }

    useEffect(() => {
        GetChapter();
    }, []);


    return (
        <>
            <NavBar5 />
            <br />
            <br />
            <br />
            <div className='bg-violet-900 w-full h-screen '>
                <div>
                    <ViewerChapter images={listaImages} />
                </div>
            </div>
            
        </>

    )


}