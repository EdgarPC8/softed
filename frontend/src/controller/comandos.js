import { rules } from "../rules/rules.js";
import {ejecutar} from "../helpers/functions.js";
import comandos from "../view/comandos.html?raw";

export default async () => {
    const mainContainer = document.querySelector("#root");
    mainContainer.innerHTML = comandos;

    ejecutar({
        Url:`${rules.ip}/ejecutar`,
        IdInput:`ejecutar`,
        Array:{
            Table:`metros`,
            Columns:[`id`,`metros`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });
    ejecutar({
        Url:`${rules.ip}/createBD`,
        IdInput:`btnCreateBD`,
        Array:{
            Table:`metros`,
            Columns:[`id`,`metros`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });

    return;
}
