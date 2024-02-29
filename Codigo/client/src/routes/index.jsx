import { createBrowserRouter } from "react-router-dom";
import PaginaInicio from '../pages/pageHome.jsx'
import Login from '../pages/login.jsx'
import Registro from '../pages/registro.jsx'
import EditarPerfil from '../pages/editarperfil.jsx'
import Perfil from '../pages/home.jsx'
export const router = createBrowserRouter([
    {
        path: "/",
        element: <PaginaInicio/>,
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/registro",
        element:<Registro/>
    },
    {
        path:"/editarp",
        element:<EditarPerfil/>
    },
    {
        path:"/perfil",
        element:<Perfil/>
    }
]);
