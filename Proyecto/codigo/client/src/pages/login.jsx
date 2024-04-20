
import Form from '../components/formlogin';
import Fotito from '../images/log2.jpeg'
import '../assets/patron.css'


export default function Login() {
    return (
        <>
            <div className='flex w-full h-screen scrollbar-hide'>

                <div className='w-full flex items-center  justify-center lg:w-1/2 bg-moradito3'>
                    <Form />
                </div>
                <div className='hidden  relative lg:flex h-full items-center w-1/2 justify-center bg-moradito3 '>
                    <img className='w-full h-full' src={Fotito} alt="" />

                </div>

            </div>
        </>
    )
}