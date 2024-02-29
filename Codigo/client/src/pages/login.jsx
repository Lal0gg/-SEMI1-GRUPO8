
import Form from '../components/Form';
import Fotito from '../images/icon4.png'
import '../assets/Patron.css'

export default function Login() {
  return (
    <div className='flex w-full h-screen scrollbar-hide'>
      
        <div className='w-full flex items-center  justify-center lg:w-1/2 xdd'>
          <Form />
        </div>
        <div className='hidden  relative lg:flex h-full items-center w-1/2 justify-center bg-blue-300 xdd'>
          <img  className='w-80 h-80 animate-bounce' src={Fotito} alt="" />
            
        </div>

      </div>
  );
}

