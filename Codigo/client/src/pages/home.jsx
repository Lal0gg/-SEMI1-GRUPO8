import Fotito from '../images/icon12.jpg'
import Perfil from '../components/Perfil';
import NavBar from '../components/NavBar'
import '../assets/Patron.css'

export default function Homepage() {
    return (
        <div className='xdd7'>
            <NavBar />
                <div className="absolute  xdd6"> 
                <div className="absolute mt-14 inset-x-0 top-0 flex items-center justify-center h-4/5">
                    <Perfil/>
                </div>
                </div>
                
            
        </div>
    );
}