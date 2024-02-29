import Fotito from '../images/icon12.jpg'
import Perfil from '../components/Perfil';
import NavBar from '../components/NavBar'

export default function Homepage() {
    return (
        <div>
            <div className="relative  w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Fotito})` }}>
            <NavBar />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nasupurple to-transparent via-nasupurple opacity-100 h-4/5">
                    
                </div>
                <div className="absolute mt-14 inset-x-0 top-0 flex items-center justify-center h-4/5">
                    <Perfil  />
                </div>
            </div>
        </div>
    );
}