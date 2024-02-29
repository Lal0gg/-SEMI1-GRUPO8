import FormActualizacion from '../components/FormActualizacion'
import SelectFoto from '../components/SelectFoto'
import '../assets/Patron.css'
import NavBarr from '../components/NavBar2'

export default function EditarPerfil() {
    return(
        <>
            
        <div className='flex w-full justify-center items-center h-screen xdd6'>
        <NavBarr/>
            <div className='flex-1 '>
                <SelectFoto />
            </div>
            <div className='flex-1'>
                <FormActualizacion />
            </div>
        </div>
    </>

    );
}