import { createBrowserRouter } from "react-router-dom";

import PaginaInicio from "../pages/pagehome";
import PaginaLogin from "../pages/login";
import PaginaRegistro from "../pages/registrar";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <PaginaInicio />,
    },
    {
        path: "/login",
        element: <PaginaLogin />,
    },
    {
        path: "/registro",
        element: <PaginaRegistro />,
    }
]);