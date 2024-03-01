import React, { useState } from 'react';
import logsito from '../images/icon0.png'
import { useNavigate } from 'react-router-dom';

export default function NavBar() {

  const navigate = useNavigate();

    const irEditarP = () => {
        navigate('/editarp');
    };

    const irRegistro = () => {
        navigate('/registro');
    };

    const irPerfil = () => {
      navigate('/Perfil');
  };


  const cerrarSesion = () => {
    navigate('/');
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full  border-b-bluebell bg-gradient-to-b from-bluebell to-transparent dark:border-bluebell z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logsito} className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FaunaDex</span>
          </a>
          <button onClick={toggleMobileMenu} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-bluebell focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-indigo-950 dark:focus:ring-indigo-950" aria-expanded={isMobileMenuOpen ? "true" : "false"}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`absolute top-full left-0 w-full md:relative md:flex md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`} id="navbar-dropdown">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-500 md:dark:bg-indigo-950 dark:border-gray-700">
              <li>
                <a onClick={cerrarSesion} className="block py-2 px-3 text-gray-900 rounded hover:bg-indigo-950md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</a>
              </li>
              <li className="relative">
                <button onClick={toggleDropdown} className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Acciones <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg></button>
                <div className={`absolute top-full left-0 z-20 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-indigo-950 dark:divide-indigo-950`}>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                    <li>
                      <a onClick={irPerfil} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-indigo-950 dark:hover:text-white">Mi Perfil</a>
                    </li>
                    <li>
                      <a onClick={irRegistro} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-indigo-950 dark:hover:text-white">Registrarse</a>
                    </li>
                    <li>
                      <a onClick={irEditarP} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-indigo-950 dark:hover:text-white">Editar Perfil</a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a onClick={cerrarSesion} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-indigo-950  dark:text-gray-200 dark:hover:text-white">Cerrar Sesion</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
