import { createBrowserRouter } from "react-router-dom";

import PaginaInicio from "../pages/pagehome";
import PaginaLogin from "../pages/login";
import PaginaRegistro from "../pages/registrar";
import PaginaMainSeries from "../pages/pageMain";
import PaginaPerfil from "../pages/perfilmanga";
import PaginaViewPrivateSeries from "../pages/viewListSeriesPriv"
import PaginaViewSerieSolitaPrivate from "../pages/serieprivateview"
import PaginaViewChapterPrivate from '../pages/viewChapterPriv'
import PaginaViewSeriesPublic from '../pages/viewListSeriesGeneral'
import PaginaViewSerieSolitaGeneral from '../pages/seriegeneralview'
import PaginaViewChapterGeneral from '../pages/viewChapterGeneral'
import PaginaViewListSeriesAdmi from '../pages/vielListSeriesAdminGe'
import PaginaViewDescriptionAdmin from '../pages/serieadminview'

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
    {
        path: "/viewprivate",
        element: <PaginaViewPrivateSeries />,
    },
    {
        path: "/viewserieprivate",
        element: <PaginaViewSerieSolitaPrivate />,
    },
    {
        path: "/viewchapterprivate",
        element: <PaginaViewChapterPrivate />,
    },
    {
        path: "/viewseriesgeneral",
        element: <PaginaViewSeriesPublic />,
    },
    {
        path: "/viewseriegeneraaaaaal",
        element: <PaginaViewSerieSolitaGeneral />,
    },
    {
        path: "/viewchaptergeneral",
        element: <PaginaViewChapterGeneral />,
    },
    {
        path: "/viewlistseriesadmi",
        element: <PaginaViewListSeriesAdmi />,
    },
    {
        path: "/viewdescriptionadmin",
        element: <PaginaViewDescriptionAdmin />,
    },


]);