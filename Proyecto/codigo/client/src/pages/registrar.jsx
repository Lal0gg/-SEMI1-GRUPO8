import FormRegis from '../components/formregistro';
import Fotito from '../images/reg.jpeg'
import NavBar2  from '../components/navbar2';

export default function Registro() {

    return (
        <>
            <NavBar2 />
            <div className='flex w-full h-screen scrollbar-hide'>

                <div className='w-full flex items-center  justify-center lg:w-1/2 bg-moradito3'>
                <img className='w-full h-full' src={Fotito} alt="" />
                </div>
                <div className='hidden  relative lg:flex h-full items-center w-1/2 justify-center bg-moradito3 '>
                    
                    <FormRegis />    
                </div>

            </div>
        </>
    );

}