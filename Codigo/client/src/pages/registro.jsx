import FormRegistro from '../components/FormReg'
import Login from './login'
import ImageContent from '../components/imageCont'
import '../assets/Patron.css'
import NavBarr from '../components/NavBar2'

export default function Registro() {
    return (
        <>
            <div className='flex w-full justify-center items-center h-screen xdd6'>
            <NavBarr/>
                <div className='flex-1'>
                    <ImageContent />
                </div>
                <div className='flex-1'>
                    <FormRegistro />
                </div>
            </div>
        </>

    )
}


