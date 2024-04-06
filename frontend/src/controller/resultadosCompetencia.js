import { rules } from "../rules/rules.js";
import resultadosCompetencia from "../view/resultadosCompetencia.html?raw";

import { getResultados,getSelects} from "../helpers/functions.js";
export default async () => {


    const mainContainer = document.querySelector("#root");
    mainContainer.innerHTML = resultadosCompetencia;



    getSelects({
        Url:`${rules.ip}/getSelects`,
        IdInput:`selectCompetencia`,
        Array:{
            Table:`competencia`,
            Columns:[`id`,`nombre`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });

    getResultados({
        IdContainer:`container_competencias`,
        Url:`${rules.ip}/getResultados`,
        Opciones:{Create:false,IdCompetencia:3}
    });


    const changeHandler = async (event) => {
        const { target } = event;
        // console.log(target)
        if (target.id == "selectCompetencia" && target.value != "Seleccione la Competencia") {
            // getCompetencia(target.value);
            // getGanador(target.value);
        }

    };
    document.addEventListener("change", changeHandler);

    return;
}
