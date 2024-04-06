import { rules } from "../rules/rules.js";
import competenciaTiempos from "../view/competenciaTiempos.html?raw";

import { getSelects,getCompentencia,getEntidadesCompetencia,inputsNumberToTime,editData} from "../helpers/functions.js";
export default async () => {
    const mainContainer = document.querySelector("#root");
    mainContainer.innerHTML = competenciaTiempos;

    // const mainContainer = document.querySelector("#root");
    // const usersContainer = document.createElement("div");
    // const response = await fetch("./view/competenciaTiempos.html");
    // const users = await response.text();
    // usersContainer.innerHTML = users;
    // mainContainer.appendChild(usersContainer);
    // const actualizar = await fetch(`${rules.ip}/api/actualizarCompetencia`);
    // const objetoCompetencia = await actualizar.json(); // Suponiendo que actualizar.json() devuelve un objeto JSON
    // const arrayCompetencia = Object.values(objetoCompetencia);
    const containerCompetencias = document.querySelector("#container_competencias");
    const btnCreateCompetencia = document.querySelector("#btnCreateCompetencia");
    const btnCreateEvento = document.querySelector("#btnCreateEvento");
    const containerSelectMetros = document.querySelector("#selectMetros");
    const containerSelectPrueba = document.querySelector("#selectPrueba");
    const containerSelectCompetencia = document.querySelector("#selectCompetencia");
    const containerSelectGrupoCompetencias = document.querySelector("#tipo_competencia");
    const containerSelectInstitucion = document.querySelector("#selectInstitucion");
    const containerCompetenciaEscuelas = document.querySelector("#collapseCompetenciaEscuelas");
    const containerCompetenciaColegios = document.querySelector("#collapseCompetenciaColegios");
    let selectArrayCompetencia = null;
    let selectedArrayFormEscuela = null;
    let selectedArrayFormColegio = null;

    getSelects({
        Url:`${rules.ip}/getSelects`,
        IdInput:`selectCompetencia`,
        Array:{
            Table:`competencia`,
            Columns:[`id`,`Concat(nombre,' ',fecha) AS nombres`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });

    // getCompentencia({
    //     IdContainer:`container_competencias`,
    //     array:{
    //         Evento:{
    //             Series:{
    //                 uno:`hola`
    //             }
    //         }
    //     }
    // });
    // console.log(await getEntidadesCompetencia({Url:`${rules.ip}/administrarCompetencia`,Opciones:{Create:false,IdCompetencia:3}}))

    // console.log(await getEntidadesCompetencia({Url:`${rules.ip}/getCompetenciaTiempos`,Opciones:{Create:false,IdCompetencia:3}}))


    getCompentencia({
        IdContainer:`container_competencias`,
        IngresoTiempos:true,
        Eventos:await getEntidadesCompetencia({Url:`${rules.ip}/getCompetenciaTiempos`,Opciones:{Create:false,IdCompetencia:3}})
    });

    const changeHandler = async (event) => {
        const { target } = event;
        // console.log(target)
        // if (target.id == "selectCompetencia" && target.value != "Seleccione la Competencia") {
        //     getCompetencia(target.value);
        // }
        
        if (target.type=="text"||target.type=="checkbox") {
           
            const id=target.id.replace(/\D/g, '');
            const campo=target.id.replace(/\d/g, '');
            console.log(campo)
            inputsNumberToTime(target);

            const columnValue = target.type =="text" ? target.value : target.checked ?1:0;
            editData({
                Url:`${rules.ip}/editData`,
                TableAjax:null,
                Array:{
                  Table:"serie",
                  Columns:{
                      [campo]:columnValue,
                  },
                  Conditions:{
                    id:id,
                  },
                },
                
              });
        }
    }

    document.addEventListener("change", changeHandler);

    
    // async function getSelect(grupo) {
    //     containerSelectCompetencia.innerHTML = `<option selected>Seleccione la Competencia</option>`;
    //     const response = await fetch(`${rules.ip}/api/getSelect/${grupo}`);
    //     const array = await response.json();
    //     const mapPrueba = array['mapPrueba'].map(prueba => ({ id: prueba.id, nombre: prueba.nombre }));
    //     const mapMetros = array['mapMetros'].map(metros => ({ id: metros.id, nombre: metros.nombre }));
    //     const mapInstitucion = array['mapInstitucion'].map(comp => ({ id: comp.id, nombre: comp.nombre }));
    //     const mapCompetencia = array['mapCompetencia'].map(comp => ({ id: comp.id, nombre: comp.nombre }));
    //     mapCompetencia.forEach(comp => {
    //         containerSelectCompetencia.innerHTML += `<option value="${comp.id}">${comp.nombre}</option>`;
    //     });
    // }
    // function divTexto(texto, posicion) {
    //     const arrayTexto = texto.split('|');
    //     return arrayTexto[posicion]
    // }

    // async function getCompetencia(id) {
    //     containerCompetencias.innerHTML = ``;
    //     const response = await fetch(`${rules.ip}/api/getCompentencia/${id}`);
    //     const obj = await response.json();

    //     if (obj != null) {
    //         const array = Object.entries(obj);
    //         console.log(array)
    //         array.forEach(function (competencia, indice, array) {
    //             containerCompetencias.innerHTML += `
    //             <div class="card mx-3 mt-3 shadow rounded" >
    //                     <div class="table-responsive">
    //                         <table class="table">
    //                             <thead>
    //                             <tr>
    //                                 <th scope="col" class="col">Evento${indice + 1}</th>
    //                                 <th scope="col" class="col">${divTexto(competencia[0], 2)}</th>
    //                                 <th scope="col" class="col">Cat:</th>
    //                                 <th scope="col" class="col">${divTexto(competencia[0], 1)}</th>
    //                                 <th scope="col" class="col">${divTexto(competencia[0], 3)}</th>
    //                                 <th scope="col" class="col"></th>
    //                                 <th scope="col" class="col"></th>
    //                             </tr>
    //                             <tr>
    //                                 <th scope="col" class="col">Cedula</th>
    //                                 <th scope="col" class="col">Nadador</th>
    //                                 <th scope="col" class="col">Institucion</th>
    //                                 <th scope="col" class="col">Tiempo</th>
    //                                 <th scope="col" class="col">N</th>
    //                                 <th scope="col" class="col">Desc</th>
    //                                 <th scope="col" class="col">Premiado</th>
    //                             </tr>
    //                             </thead>
    //                             <tbody id="competencia${indice}">`;

    //             const arraySeries = Object.entries(competencia[1]);
    //             let eventoHtml = '';
    //             arraySeries.forEach(function (serie, index) {
    //                 eventoHtml += `
    //                                         <tr>
    //                                             <td scope="col" class="col text-center" colspan="7">${serie[0]}</td>
    //                                             `;
    //                 const arrayNadadores = Object.entries(serie[1]);
    //                 arrayNadadores.forEach(function (nad, indexNad) {
    //                     let lugar="";
    //                     let descalificadoChecked="";
    //                     let premiadoChecked="";
    //                     if(nad[1]["lugar"]!=null){
    //                         lugar=nad[1]["lugar"];
    //                     }
    //                     if(nad[1]["descalificado"]==1){
    //                         descalificadoChecked="checked";
    //                     }
    //                     if(nad[1]["premiado"]==1){
    //                         premiadoChecked="checked";
    //                     }
    //                     eventoHtml += `
    //                                                     <tr>
    //                                                         <td scope="col" class="col">${nad[1]["cedula"]}</td>
    //                                                         <td scope="col" class="col">${nad[1]["nadador"]}</td>
    //                                                         <td scope="col" class="col">${nad[1]["institucion"]}</td>
    //                                                         <td scope="col" class="col">
    //                                                         <input 
    //                                                             type="text" 
    //                                                             class="form-control" 
    //                                                             autocomplete="off"
    //                                                             maxlength="8"
    //                                                             name="tiempo${nad[1]["id"]}"
    //                                                             id="tiempo${nad[1]["id"]}"
    //                                                             value="${nad[1]["tiempo"]}"
    //                                                         >
    //                                                         </td>
    //                                                         <td scope="col" class="col">
    //                                                         ${lugar}
    //                                                         </td>
    //                                                         <td scope="col" class="col">
    //                                                             <input 
    //                                                                 class="form-check-input" 
    //                                                                 type="checkbox" 
    //                                                                 id="descalificado${nad[1]["id"]}" 
    //                                                                 ${descalificadoChecked}
    //                                                                 />
    //                                                                 </td>
    //                                                         <td scope="col" class="col">
    //                                                                 <input 
    //                                                                 class="form-check-input" 
    //                                                                 type="checkbox" 
    //                                                                 id="premiado${nad[1]["id"]}" 
    //                                                                 ${premiadoChecked}
    //                                                             />
    //                                                         </td>
    //                                                     </tr>
    //                                             `;
    //                 });
    //                 eventoHtml += `</tr>`;
    //             });
    //             document.querySelector(`#competencia${indice}`).innerHTML += eventoHtml;
    //             containerCompetencias.innerHTML += `</tbody>
                                    
    //                         </table>
    //                     </div>
    //                  </div>
    //             `;
    //         });
    //     }
    // }
    // getSelect(2);
    // const submitHandler = async (event) => {
    //     const { target } = event;
    //     event.preventDefault();
        
    // };
    // const changeHandler = async (event) => {
    //     const { target } = event;
    //     // console.log(target)
    //     if (target.id == "selectCompetencia" && target.value != "Seleccione la Competencia") {
    //         getCompetencia(target.value);
    //     }
    //     if (target.id.replace(/[0-9]/g, '')=="tiempo") {
    //         inputsNumberToTime(target);
    //         const id=target.id.replace(/\D/g, '');
    //         const response = await fetch(`${rules.ip}/api/putTimeCompetencia/${id}/${target.value}`);
    //         // const array = await response.json();
    //         // console.log(target.value)
    //     }


    // };
    // const keyUpHandler = async (event) => {
    //     const { target } = event;
    //     if (target.value !== "" && target.id === "nadador") {
    //         const response = await fetch(`${rules.ip}/api/nadador/${target.value}`);
    //         const inst = await response.json();
    //         let elementList = "";
    //         const LIST = target.parentElement.children[1];

    //         if (inst !== "not found" && target.value != "") {
    //             inst.forEach(
    //                 (nad) =>
    //                 (elementList += `
    //                 <li class='dropdown-item'name='itemNadador'" >${nad.nadador}</li>
    //                 <input type='hidden' value='${nad.cedula}' />
    //                 <input type='hidden' value='${nad.fecha_nacimiento}' />
    //               `)
    //             );
    //             target.classList.add("show");
    //             LIST.classList.add("show");
    //             LIST.innerHTML = elementList;
    //         } else {
    //             LIST.classList.remove("show");
    //             LIST.innerHTML = "";
    //         }
    //     }
    // };
    // const buttonClickHandler = async (event) => {
    //     const { target } = event;
    //     if (target.getAttribute("type") === "checkbox" ){
    //         if(target.id.replace(/[0-9]/g, '')=="descalificado"){
    //             const array = {
    //                 descalificado: target.checked ? 1 : 0
    //             };
    //             const objNadadorConfig = {
    //                 id: "id="+target.id.replace(/\D/g, ''),
    //                 tabla: "serie",
    //                 array: array,
    //             };
    //             fetch(`${rules.ip}/api/changeDescPuntos`, {
    //                 method: "POST",
    //                 body: JSON.stringify(objNadadorConfig),
    //                 mode: "cors",
    //             });
    //         }
    //         if(target.id.replace(/[0-9]/g, '')=="premiado"){
    //             const array = {
    //                 premiado: target.checked ? 1 : 0
    //             };
    //             const objNadadorConfig = {
    //                 id: "id="+target.id.replace(/\D/g, ''),
    //                 tabla: "serie",
    //                 array: array,
    //             };
    //             fetch(`${rules.ip}/api/changeDescPuntos`, {
    //                 method: "POST",
    //                 body: JSON.stringify(objNadadorConfig),
    //                 mode: "cors",
    //             });
    //         }
            
    //     }
    // };
    // const keyDownHandler = async (event) => {
    //     const { target } = event;
    //     // console.log(target.id.replace(/[0-9]/g, ''))
    //     if (target.id.replace(/[0-9]/g, '')=="tiempo") {
    //         inputsSoloNumeros(event);
    //     }
    // };
    // document.addEventListener('click', buttonClickHandler);
    // document.addEventListener("submit", submitHandler);
    // document.addEventListener("change", changeHandler);
    // document.addEventListener("keyup", keyUpHandler);
    // document.addEventListener("keydown", keyDownHandler);

    return;
}
