
import Form from './Form';
import Fotito from '../images/icon4.png'

export default function Login() {
  return (
    <div className='flex w-full h-screen scrollbar-hide'>
      
        <div className='w-full flex items-center  justify-center lg:w-1/2'>
          <Form />
        </div>
        <div className='hidden  relative lg:flex h-full items-center w-1/2 justify-center bg-blue-300'>
          <img  className='w-80 h-80 animate-bounce' src={Fotito} alt="" />
            
        </div>

      </div>
  );
}

