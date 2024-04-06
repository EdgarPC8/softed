import { rules } from "../rules/rules.js";
import {getSelects,getRecords} from "../helpers/functions.js";
import records from "../view/records.html?raw";



export default async () => {
    const mainContainer = document.querySelector("#root");
    mainContainer.innerHTML = records;
    getSelects({
        Url:`${rules.ip}/getSelects`,
        IdInput:`nadador`,
        Array:{
            Table:`nadador`,
            Columns:[`cedula`,`Concat(nombres,' ',apellidos) AS nombres`],
            Conditions:{},
            GroupBy:null,
            OrderBy:"nombres",
        },
    });
    getSelects({
        Url:`${rules.ip}/getSelects`,
        IdInput:`metros`,
        Array:{
            Table:`metros`,
            Columns:[`metros`,`metros`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });
    
    const changeHandler = async (event) => {
        const { target } = event;
        const nadador =  document.querySelector("#nadador").value;
        const metros =  document.querySelector("#metros").value;

        if (target.id == "nadador" || target.id == "metros" && target.value != "Seleccione una Opcion") {

            let arrayTiempos=await getRecords({
                Url:`${rules.ip}/getRecords`,
                Array:{
                    Table:`tiempos`,
                    Columns:[`DISTINCT MIN(tiempo) AS tiempo,cedula,prueba,metros`],
                    Conditions:{cedula:nadador,metros:metros},
                    GroupBy:`metros,prueba`,
                    OrderBy:null,
                },
            });
            document.querySelector("#Libre").value=''
            document.querySelector("#Espalda").value=''
            document.querySelector("#Pecho").value=''
            document.querySelector("#Mariposa").value=''
            document.querySelector("#PR_L").value=''
            document.querySelector("#PR_E").value=''
            document.querySelector("#PR_P").value=''
            document.querySelector("#PR_M").value=''
            document.querySelector("#BR_L").value=''
            document.querySelector("#BR_E").value=''
            document.querySelector("#BR_P").value=''
            document.querySelector("#BR_M").value=''
            document.querySelector("#CI").value=''
            document.querySelector("#pruebas10").value=''
            document.querySelector("#pruebas12").value=''

            arrayTiempos.forEach(element => {
                if(element.prueba=="Libre")document.querySelector("#Libre").value=element.tiempo
                if(element.prueba=="Espalda")document.querySelector("#Espalda").value=element.tiempo
                if(element.prueba=="Pecho")document.querySelector("#Pecho").value=element.tiempo
                if(element.prueba=="Mariposa")document.querySelector("#Mariposa").value=element.tiempo

                if(element.prueba=="PR_L")document.querySelector("#PR_L").value=element.tiempo
                if(element.prueba=="PR_E")document.querySelector("#PR_E").value=element.tiempo
                if(element.prueba=="PR_P")document.querySelector("#PR_P").value=element.tiempo
                if(element.prueba=="PR_M")document.querySelector("#PR_M").value=element.tiempo

                if(element.prueba=="BR_L")document.querySelector("#BR_L").value=element.tiempo
                if(element.prueba=="BR_E")document.querySelector("#BR_E").value=element.tiempo
                if(element.prueba=="BR_P")document.querySelector("#BR_P").value=element.tiempo
                if(element.prueba=="BR_M")document.querySelector("#BR_M").value=element.tiempo

                if(element.prueba=="CI")document.querySelector("#CI").value=element.tiempo
                if(element.prueba=="10Pruebas")document.querySelector("#pruebas10").value=element.tiempo
                if(element.prueba=="12Pruebas")document.querySelector("#pruebas12").value=element.tiempo
                
            });

            
            console.log(arrayTiempos)


        }


    };

    document.addEventListener("change", changeHandler);

    return;
}
