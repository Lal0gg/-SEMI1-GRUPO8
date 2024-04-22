import { createBrowserRouter } from "react-router-dom";

import PaginaInicio from "../pages/pagehome";
import PaginaLogin from "../pages/login";
import PaginaRegistro from "../pages/registrar";
import PaginaMainSeries from "../pages/pageMain";
import PaginaPerfil from "../pages/perfilmanga";

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
    },
    {
        path: "/main",
        element: <PaginaMainSeries />,
    },
    {
        path: "/perfil",
        element: <PaginaPerfil />,
    },
    {
        path: "*",
        element: <PaginaInicio />,
    },
]);