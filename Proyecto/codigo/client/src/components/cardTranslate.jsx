import React from 'react';
import Service from '../services/Service';
import { useState } from 'react';
import { useEffect } from 'react';
const Flashcard = ({ lista }) => {

    const [valueFrase, setValueFrase] = useState('')
    const [valueVoz, setValueVoz] = useState('')
    const [valueLenguage, setValueLenguage] = useState('')
    const [srcAudio, setSrcAudio] = useState('')
    const [origText, setOrigText] = useState('')
    const [tradText, setTradText] = useState('')

    const handlerTranslate = async () => {
        console.log("Traduciendo...")
        console.log("Frase: ", valueFrase)
        console.log("Voz: ", valueVoz)
        console.log("Lenguage: ", valueLenguage)
        console.log("URL: ", valueVoz)

        Service.TraductionYAudio(valueFrase, valueVoz,valueLenguage, valueVoz).then((res) => {
            console.log("Traducción: ", res.data)
            const urlaudio = res.data.audioURL;
            const traduccion = res.data.translatedText;
            const original = res.data.originalText;
            console.log("Traducción: ", traduccion)
            console.log("URL Audio: ", urlaudio)
            console.log("Original: ", HandlerNameAudio(original))
            setSrcAudio(HandlerNameAudio(urlaudio))
            setTradText(traduccion)
            setOrigText(original)
        } ).catch((error) => {
            console.error(error);
            if (error.response.status === 500) {
                alert("No se puede obtener la traducción, datos incorrectos")
            }
        });
    }


    const HandlerNameAudio = (trs) => {
        let nuevtrs = trs.replace(/\s+/g, "")
        return nuevtrs;
    }
    useEffect(() => {
        // Aquí dentro, srcAudio será actualizado después de cada renderización
        // Se ejecutará cada vez que srcAudio se actualice
        const audioElement = document.getElementById('audioElement');
        if (audioElement) {
            audioElement.load(); // Forzar recarga del elemento de audio
        }
    },); // Ejecutar solo cuando srcAudio cambie

    return (

        <div className="bg-transparent  rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="text-2xl font-bold text-center mb-2">{origText}</div>
            <div className="text-xl text-center text-gray-600">{tradText}</div>
            <div className="flex items-center justify-center">
                {/*srcAudio */}
                <audio id="audioElement" controls className="w-full max-w-xs">
                    <source src={srcAudio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div className="flex justify-center mt-4">
                {/*valuVoz */}
                <select className="bg-teal-500 hover:bg-teal-800 text-white rounded ml-2 text-center w-full h-7" 
                        onChange={(e) => setValueVoz(e.target.value)}

                >
                    <option defaultValue="" disabled selected hidden>Voz</option>
                    <option value="en-US">en-US</option>
                    <option value="es-ES">es-ES</option>
                    <option value="ja-JP">ja-JP</option>
                </select>
                {/*valueLenguage */}
                <select className="bg-pink-500 hover:bg-pink-800 text-white rounded ml-2 text-center w-full h-7"
                        onChange={(e) => setValueLenguage(e.target.value)}
                >
                    <option  defaultValue="" disabled selected hidden>Lenguage</option>
                    <option value="en">en</option>
                    <option value="ja">ja</option>
                    <option value="es">es</option>
                </select>
                {/*valueFrase */}
                <select className="bg-violet-500 hover:bg-violet-800 text-white rounded ml-2 text-center w-full h-7"
                        onChange={(e) => setValueFrase(e.target.value)}
                >
                    <option defaultValue="" disabled selected hidden>Frase</option>
                    {lista.map((index, i) => (
        <option key={i} value={index.text}>
            {index.text}
        </option>
    ))}
                </select>
                <button className="bg-indigo-500 hover:bg-indigo-800 text-white font-bold w-full h-7 rounded ml-2"
                        onClick={handlerTranslate}
                >
                    Translate
                </button>
            </div>
        </div>

    );
};

export default Flashcard;