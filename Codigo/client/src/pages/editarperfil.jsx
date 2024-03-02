import FormActualizacion from '../components/FormActualizacion'
import '../assets/Patron.css'
import NavBarr from '../components/NavBar2'

export default function EditarPerfil() {
    return(
        <>
        <div >
        <NavBarr/>
            <div >
                <FormActualizacion />
            </div>
        </div>
    </>

    );
}