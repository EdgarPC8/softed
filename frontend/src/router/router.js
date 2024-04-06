import { render } from "../controller/main.js";
import urlParser from "../helpers/urlParser.js";
import { rules } from "../rules/rules.js";

export const router = async (route) => {
    const url = urlParser(route);
    const pattern = /\/\d+|\d+\//g;
    const currentRoute = url.replace(pattern, '').replace(/\/$/, "");
    const root = document.querySelector("#root");
    const default2 = "/home";
    // const session = await fetch(`${rules.ip}/system_clinic/src/api/auth`);
    // const dataSession  = await session.json();
    const allRoutes = {
        "/home": render.home,
        "/clasificacion": render.clasificacion,
        "/times": render.times,
        "/comandos": render.comandos,
        "/records": render.records,
        "/info": render.info,
        "/competencia": render.competencia,
        "/competenciaTiempos": render.competenciaTiempos,
        "/resultadosCompetencia": render.resultadosCompetencia,
        "/comparacion": render.comparacion,
    };

    // const session =  await  fetch(`${rules.ip}/getSession`, {
    //     method: "GET",
    //     mode: "cors",
    // })
    // const verificacionSession=await session.json()


    
    // const session = await fetch(`${rules.ip}/getSession`);
    // const dataSession  = await session.json();
    // console.log(dataSession)




        let showView = allRoutes[currentRoute] ?? allRoutes[default2];
        // location.reload();
        root.innerHTML = "";
        render.header();
        showView();

    // }

}