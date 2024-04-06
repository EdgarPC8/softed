import { rules } from "../rules/rules.js";
import { inputsNumberToTime, inputsTimeToNumber, inputsSoloNumeros, getDateNow, inputsDisabled, inputsAddTimes, inputsClear } from "../helpers/functions.js";


export default async () => {
    const mainContainer = document.querySelector("#root");
    const usersContainer = document.createElement("div");
    const response = await fetch("./view/comparacion.html");
    const users = await response.text();

    usersContainer.innerHTML = users;
    mainContainer.appendChild(usersContainer);

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
    const containerSelectInstitucion= document.querySelector("#selectInstitucion");
    const containerCompetenciaEscuelas= document.querySelector("#collapseCompetenciaEscuelas");
    const containerCompetenciaColegios= document.querySelector("#collapseCompetenciaColegios");
    const tiemposCompetencia= document.querySelector("#tiemposCompetencia");
    let selectArrayCompetencia=null;
    let selectedArrayFormEscuela=null;
    let selectedArrayFormColegio=null;
   
    async function getCompetencias() {
        containerCompetencias.innerHTML = ``;
        containerCompetenciaEscuelas.innerHTML = ``;
        containerCompetenciaColegios.innerHTML = ``;
        const response = await fetch(`${rules.ip}/api/getCompetencias`);
        const array = await response.json();
        const mapCompetencia = array['mapCompetencia'].map(competencia => ({ id: competencia.id, nombre: competencia.nombre, fecha: competencia.fecha }));
        const mapEvento = array['mapEvento'].map(evento => ({ id_competencia: evento.id_competencia, numero: evento.numero, prueba: evento.prueba, categoria: evento.categoria, genero: evento.genero }));
        const mapEscuelas = array['mapEscuelas'].map(escuela => ({ id: escuela.id, nombre: escuela.nombre}));
        const mapColegios = array['mapColegios'].map(colegio => ({ id: colegio.id, nombre: colegio.nombre}));

        const mapAsignacionNadEsc = array['mapAsignacionNadEsc'].map(asigEscuela => ({ 
            id: asigEscuela.id, 
            cedula: asigEscuela.cedula, 
            nadador: asigEscuela.nadador, 
            genero: asigEscuela.genero, 
            fecha_nacimiento: asigEscuela.fecha_nacimiento, 
            categoria: asigEscuela.categoria, 
            id_institucion: asigEscuela.id_institucion, 
            nombreInstitucion: asigEscuela.nombreInstitucion,
            configCheck: asigEscuela.configCheck
        }));
        const mapAsignacionNadCol = array['mapAsignacionNadCol'].map(asigColegio => ({ 
            id: asigColegio.id, 
            cedula: asigColegio.cedula, 
            nadador: asigColegio.nadador, 
            genero: asigColegio.genero, 
            fecha_nacimiento: asigColegio.fecha_nacimiento, 
            categoria: asigColegio.categoria, 
            id_institucion: asigColegio.id_institucion, 
            nombreInstitucion: asigColegio.nombreInstitucion,
            configCheck: asigColegio.configCheck
        }));
        if(arrayCompetencia[0].length!==0){
            const arrayDos = Object.entries(arrayCompetencia[0]);


            arrayDos[0].forEach((element, index) => {
                const datosObjeto = arrayDos[index][1];
                const clavesOrdenadas = Object.keys(datosObjeto).sort(compararClaves);
                // Crear un nuevo objeto ordenado
                const datosOrdenados = {};
                clavesOrdenadas.forEach((clave) => {
                datosOrdenados[clave] = datosObjeto[clave];
                });
                // Reemplazar el objeto original con el objeto ordenado
                arrayDos[index][1] = datosOrdenados;

            });
            const competencia = arrayDos.map((comp, index) => ({ 
                nombre: comp[0], 
                id: index ,
                eventos:comp[1]
            }));
            selectArrayCompetencia=competencia;
            // getSelect(2);

            competencia.forEach(competencia => {
                containerCompetencias.innerHTML +=`
                    <div class="card mx-3 mt-3 shadow rounded" >
                    <h6 class="card-header">
                        <div class="row g-3">

                            <div class="col-6">
                                <a class="nav-link dropdown-toggle p-0" data-bs-toggle="collapse" 
                                aria-controls="collapseCompetencia${competencia.id}" role="button" 
                                href="#collapseCompetencia${competencia.id}">
                                    ${competencia.nombre}
                                </a>
                            </div>
                            <div class="col">
                                <input class="form-check-input" type="checkbox" id="check${competencia.nombre}${competencia.id}" name="check${competencia.nombre}${competencia.id}"/>
                                <button class="btn btn-dark text-right" type="button" id="btn${competencia.nombre}">
                                Guardar
                                </button>
                            
                            </div>
                            
                        </div>
                    </h6>
                    <div  class="collapse" id="collapseCompetencia${competencia.id}">
                        <div class="table-responsive">
                            <table class="table" id="tablaCompetencia${competencia.id}">
                                <thead>
                                    
                                </thead>
                                <tbody id="competencia${competencia.id}">
                                `
                                const array = Object.entries(competencia.eventos);
                                const eventos = array.map((event, index) => ({ 
                                    id: index,
                                    numEvento: divEvento(event[0],0)+(index+1),
                                    cat: divEvento(event[0],1),
                                    prueba: seleccionMetrosPorCategorias(divEvento(event[0],2),divEvento(event[0],1)),
                                    genero: divEvento(event[0],3),
                                    series: event[Object.keys(event)[1]]
                                }));
                                let html = '';
                                
                                if(selectedArrayFormEscuela==null&& competencia.nombre=="Escuela"){
                                    selectedArrayFormEscuela=eventos;
                                }
                                if(selectedArrayFormColegio==null && competencia.nombre=="Colegio"){
                                    selectedArrayFormColegio=eventos;
                                }
                                eventos.forEach((evento, index) => {
                                if (index % 2 === 0) {
                                    // Registro par, se coloca a la izquierda
                                    html += `
                                    <tr>
                                        <td>
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" class="col">${evento.numEvento}</th>
                                                            <th scope="col" class="col">${evento.prueba}</th>
                                                            <th scope="col" class="col">Cat:</th>
                                                            <th scope="col" class="col">${evento.cat}</th>
                                                            <th scope="col" class="col">${evento.genero}</th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" class="col">Cedula</th>
                                                            <th scope="col" class="col">Nadador</th>
                                                            <th scope="col" class="col">Institucion</th>
                                                            <th scope="col" class="col">Tiempo</th>
                                                            <th scope="col" class="col">N</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="evento${evento.id}">`;
                                                        const arraySeries = Object.entries(evento.series);
                                                        const series = arraySeries.map((serie, index) => ({ 
                                                            id: index,
                                                            nadadores:serie[Object.keys(serie)[1]]
                                                        }));
                                                        let eventoHtml = '';
                                                        series.forEach((serie, index) => {
                                                            eventoHtml += `
                                                                <tr>
                                                                    <td scope="col" class="col text-center" colspan="5">Serie${index+1}</td>
                                                                    `;
                                                                    const arrayNadadores = Object.entries(serie.nadadores);
                                                                    const nadadores = arrayNadadores.map((nad, index) => ({ 
                                                                        id: index,
                                                                        cedula:nad[1]["cedula"],
                                                                        nadador:nad[1]["nadador"],
                                                                        institucion:nad[1]["institucion"],
                                                                        tiempo:nad[1]["tiempo"],
                                                                    }));
                                                                    nadadores.forEach((nad, index) => {
                                                                        eventoHtml += `
                                                                            <tr>
                                                                            <td scope="col" class="col">${nad.cedula}</td>
                                                                            <td scope="col" class="col">${nad.nadador}</td>
                                                                            <td scope="col" class="col">${nad.institucion}</td>
                                                                            <td scope="col" class="col">${nad.tiempo}</td>
                                                                            <td scope="col" class="col"></td>
                                                                            </tr>
                                                                    `;
                                                                    });
                                                                    eventoHtml += `
                                                                </tr>
                                                            `;
                                                        });
                                                        html+= eventoHtml;
                                                        
                                                    html +=`</tbody>
                                                </table>
                                            </div>
                                        </td>
                                    `;
                                } else {
                                    // Registro impar, se coloca a la derecha y se cierra la fila actual
                                    html += `
                                        <td>
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" class="col">${evento.numEvento}</th>
                                                            <th scope="col" class="col">${evento.prueba}</th>
                                                            <th scope="col" class="col">Cat:</th>
                                                            <th scope="col" class="col">${evento.cat}</th>
                                                            <th scope="col" class="col">${evento.genero}</th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" class="col">Cedula</th>
                                                            <th scope="col" class="col">Nadador</th>
                                                            <th scope="col" class="col">Institucion</th>
                                                            <th scope="col" class="col">Tiempo</th>
                                                            <th scope="col" class="col">N</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="evento${evento.id}">`
                                                    const arraySeries = Object.entries(evento.series);
                                                    const series = arraySeries.map((serie, index) => ({ 
                                                        id: index,
                                                        nadadores:serie[Object.keys(serie)[1]]
                                                    }));
                                                        let eventoHtml = '';
                                                        series.forEach((serie, index) => {
                                                            eventoHtml += `
                                                                <tr>
                                                                    <td scope="col" class="col text-center" colspan="5">Serie${index+1}</td>
                                                                    `;
                                                                    const arrayNadadores = Object.entries(serie.nadadores);
                                                                    const nadadores = arrayNadadores.map((nad, index) => ({ 
                                                                        id: index,
                                                                        cedula:nad[1]["cedula"],
                                                                        nadador:nad[1]["nadador"],
                                                                        institucion:nad[1]["institucion"],
                                                                        tiempo:nad[1]["tiempo"],
                                                                    }));
                                                                    nadadores.forEach((nad, index) => {
                                                                        eventoHtml += `
                                                                            <tr>
                                                                            <td scope="col" class="col">${nad.cedula}</td>
                                                                            <td scope="col" class="col">${nad.nadador}</td>
                                                                            <td scope="col" class="col">${nad.institucion}</td>
                                                                            <td scope="col" class="col">${nad.tiempo}</td>
                                                                            <td scope="col" class="col"></td>
                                                                            </tr>
                                                                    `;
                                                                    });
                                                                    eventoHtml += `
                                                                </tr>
                                                            `;
                                                        });
                                                        html+= eventoHtml;
    
                                                    html +=`</tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
    
                                    `;
                                }
                                });
                                // Agregar el contenido completo al DOM en una sola operación
                                document.querySelector(`#competencia${competencia.id}`).innerHTML = html;
    
                containerCompetencias.innerHTML +=`
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
                 `;
            });

        }
        
        //Esto es la asignacion
        mapEscuelas.forEach(escuela => {
            containerCompetenciaEscuelas.innerHTML +=`
                <div class="card mx-3 mt-3 shadow rounded" >
                <h6 class="card-header">
                    <a class="nav-link dropdown-toggle p-0" data-bs-toggle="collapse" aria-controls="collapseEscuela${escuela.id}" role="button" href="#collapseEscuela${escuela.id}">
                        Escuela ${escuela.nombre}
                    </a>
                </h6>
                <div  class="collapse" id="collapseEscuela${escuela.id}">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="col">Cedula</th>
                                    <th scope="col" class="col">Nadador</th>
                                    <th scope="col" class="col">Genero</th>
                                    <th scope="col" class="col">Edad</th>
                                    <th scope="col" class="col">Cat</th>
                                    <th scope="col" class="col">25PR_L</th>
                                    <th scope="col" class="col">25PR_E</th>
                                    <th scope="col" class="col">25Lib</th>
                                    <th scope="col" class="col">25Esp</th>
                                    <th scope="col" class="col">25Pech</th>
                                    <th scope="col" class="col">25Mari</th>
                                    <th scope="col" class="col">100CI</th>
                                    <th scope="col" class="col">Accion</th>
                                </tr>
                            </thead>
                            <tbody id="escuela${escuela.id}">
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
             `;
        });
        mapColegios.forEach(colegio => {
            containerCompetenciaColegios.innerHTML +=`
                <div class="card mx-3 mt-3 shadow rounded" >
                <h6 class="card-header">
                    <a class="nav-link dropdown-toggle p-0" data-bs-toggle="collapse" aria-controls="collapseColegio${colegio.id}" role="button" href="#collapseColegio${colegio.id}">
                        Colegio ${colegio.nombre}
                    </a>
                </h6>
                <div  class="collapse" id="collapseColegio${colegio.id}">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="col">Cedula</th>
                                    <th scope="col" class="col">Nadador</th>
                                    <th scope="col" class="col">Genero</th>
                                    <th scope="col" class="col">Edad</th>
                                    <th scope="col" class="col">Cat</th>
                                    <th scope="col" class="col">50Lib</th>
                                    <th scope="col" class="col">50Esp</th>
                                    <th scope="col" class="col">50Pech</th>
                                    <th scope="col" class="col">50Mari</th>
                                    <th scope="col" class="col">100CI</th>
                                </tr>
                            </thead>
                            <tbody id="colegio${colegio.id}">
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
             `;
        });
        function procesarEscuelas(asigEscuela) {
            const arrayConfigCheck = JSON.parse(asigEscuela.configCheck);
            document.querySelector(`#escuela${asigEscuela.id_institucion}`).innerHTML +=`
            <tr>
                <td class="col-1">${asigEscuela.cedula}</td>
                <td class="col-5">${asigEscuela.nadador}</td>
                <td class="col-1">${asigEscuela.genero}</td>
                <td class="col-1">${asigEscuela.fecha_nacimiento}</td>
                <td class="col-1">${asigEscuela.categoria}</td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox25PR_L${asigEscuela.cedula}" name="checkBox25PR_L${asigEscuela.cedula}"/></td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox25PR_E${asigEscuela.cedula}" name="checkBox25PR_E${asigEscuela.cedula}"/></td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox25Lib${asigEscuela.cedula}" name="checkBox25Lib${asigEscuela.cedula}"/></td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox25Esp${asigEscuela.cedula}" name="checkBox25Esp${asigEscuela.cedula}"/></td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox25Pech${asigEscuela.cedula}" name="checkBox25Pech${asigEscuela.cedula}"/></td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox25Mari${asigEscuela.cedula}" name="checkBox25Mari${asigEscuela.cedula}"/></td>
                <td class="col-1"><input class="form-check-input" type="checkbox" id="checkBox100CI${asigEscuela.cedula}" name="checkBox100CI${asigEscuela.cedula}"/></td>
                <td class="col-1"><button id="nadador${asigEscuela.id}">Eliminar</button></td>
            </tr>
            `;
            // Accede a las casillas de verificación dentro de un callback para asegurarte de que estén disponibles en el DOM
            setTimeout(() => {
              const checkBox25PR_L = document.querySelector(`#checkBox25PR_L${asigEscuela.cedula}`);
              const checkBox25PR_E = document.querySelector(`#checkBox25PR_E${asigEscuela.cedula}`);
              const checkBox25Lib = document.querySelector(`#checkBox25Lib${asigEscuela.cedula}`);
              const checkBox25Esp = document.querySelector(`#checkBox25Esp${asigEscuela.cedula}`);
              const checkBox25Pech = document.querySelector(`#checkBox25Pech${asigEscuela.cedula}`);
              const checkBox25Mari = document.querySelector(`#checkBox25Mari${asigEscuela.cedula}`);
              const checkBox100CI = document.querySelector(`#checkBox100CI${asigEscuela.cedula}`);
              
              // Continúa con el código para establecer los atributos "checked" según los valores de arrayConfigCheck
            if(checkBox25PR_L&&arrayConfigCheck.PR_L=="0")checkBox25PR_L.checked = false;else checkBox25PR_L.checked = true;
            if(checkBox25PR_E&&arrayConfigCheck.PR_E=="0")checkBox25PR_E.checked = false;else checkBox25PR_E.checked = true;
            if(checkBox25Lib&&arrayConfigCheck.Lib=="0")checkBox25Lib.checked = false;else checkBox25Lib.checked = true;
            if(checkBox25Esp&&arrayConfigCheck.Esp=="0")checkBox25Esp.checked = false;else checkBox25Esp.checked = true;
            if(checkBox25Pech&&arrayConfigCheck.Pech=="0")checkBox25Pech.checked = false;else checkBox25Pech.checked = true;
            if(checkBox25Mari&&arrayConfigCheck.Mari=="0")checkBox25Mari.checked = false;else checkBox25Mari.checked = true;
            if(checkBox100CI&&arrayConfigCheck.CI=="0")checkBox100CI.checked = false;else checkBox100CI.checked = true;


              // Obtener referencia al botón "Eliminar" correctamente
    const eliminarBtn = document.querySelector(`#nadador${asigEscuela.id}`);
    eliminarBtn.addEventListener('click', () => {
        Swal.fire({
            title: "Nadador",
            text: "¿Estás seguro que desea elminar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#dc3545",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
                var fila = eliminarBtn.parentNode.parentNode;
                var tabla = fila.parentNode;
                tabla.removeChild(fila);
                fetch(`${rules.ip}/api/deleteAsigNad/${eliminarBtn.id}`, {
                    method: "POST",
                    mode: "cors",
                }).then((response) => response.json())
                    .then((data) => {
                    if (data)
                        Swal.fire("Asignacion", "Eliminada con Exito!", "success").then();
                    else
                        Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Datos erroneos",
                        })
                    })
                    .catch((error) => {
                    console.log(error);
                    });

            }
          });
    });
            }, 0); // Se utiliza un tiempo de espera mínimo de 0 para asegurar que el callback se ejecute después de que el DOM se haya actualizado.
          }
        mapAsignacionNadEsc.forEach(procesarEscuelas);
        function procesarColegios(asigColegio,index) {
            const arrayConfigCheck = JSON.parse(asigColegio.configCheck);
            document.querySelector(`#colegio${asigColegio.id_institucion}`).innerHTML +=`
            <tr>
                <td>${asigColegio.cedula}</td>
                <td class="col-3">${asigColegio.nadador}</td>
                <td class="col-1">${asigColegio.genero}</td>
                <td>${asigColegio.fecha_nacimiento}</td>
                <td>${asigColegio.categoria}</td>
                <td><input class="form-check-input" type="checkbox" id="checkBox50Lib${asigColegio.cedula}" name="checkBox50Lib${asigColegio.cedula}"/></td>
                <td><input class="form-check-input" type="checkbox" id="checkBox50Esp${asigColegio.cedula}" name="checkBox50Esp${asigColegio.cedula}"/></td>
                <td><input class="form-check-input" type="checkbox" id="checkBox50Pech${asigColegio.cedula}" name="checkBox50Pech${asigColegio.cedula}"/></td>
                <td><input class="form-check-input" type="checkbox" id="checkBox50Mari${asigColegio.cedula}" name="checkBox50Mari${asigColegio.cedula}"/></td>
                <td><input class="form-check-input" type="checkbox" id="checkBox100CI${asigColegio.cedula}" name="checkBox100CI${asigColegio.cedula}"/></td>
                <td><button id="nadador${asigColegio.id}">Eliminar</button></td>
            </tr>
            `;
            // Accede a las casillas de verificación dentro de un callback para asegurarte de que estén disponibles en el DOM
            setTimeout(() => {
              const checkBox50Lib = document.querySelector(`#checkBox50Lib${asigColegio.cedula}`);
              const checkBox50Esp = document.querySelector(`#checkBox50Esp${asigColegio.cedula}`);
              const checkBox50Pech = document.querySelector(`#checkBox50Pech${asigColegio.cedula}`);
              const checkBox50Mari = document.querySelector(`#checkBox50Mari${asigColegio.cedula}`);
              const checkBox100CI = document.querySelector(`#checkBox100CI${asigColegio.cedula}`);
              
              // Continúa con el código para establecer los atributos "checked" según los valores de arrayConfigCheck
            if(checkBox50Lib&&arrayConfigCheck.Lib=="0")checkBox50Lib.checked = false;else checkBox50Lib.checked = true;
            if(checkBox50Esp&&arrayConfigCheck.Esp=="0")checkBox50Esp.checked = false;else checkBox50Esp.checked = true;
            if(checkBox50Pech&&arrayConfigCheck.Pech=="0")checkBox50Pech.checked = false;else checkBox50Pech.checked = true;
            if(checkBox50Mari&&arrayConfigCheck.Mari=="0")checkBox50Mari.checked = false;else checkBox50Mari.checked = true;
            if(checkBox100CI&&arrayConfigCheck.CI=="0")checkBox100CI.checked = false;else checkBox100CI.checked = true;


            const eliminarBtn = document.querySelector(`#nadador${asigColegio.id}`);
            eliminarBtn.addEventListener('click', () => {
                Swal.fire({
                    title: "Nadador",
                    text: "¿Estás seguro que desea elminar?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#dc3545",
                    confirmButtonText: "Sí, confirmar",
                    cancelButtonText: "Cancelar",
                  }).then((result) => {
                    if (result.isConfirmed) {
                        var fila = eliminarBtn.parentNode.parentNode;
                        var tabla = fila.parentNode;
                        tabla.removeChild(fila);
                        fetch(`${rules.ip}/api/deleteAsigNad/${eliminarBtn.id}`, {
                            method: "POST",
                            mode: "cors",
                        }).then((response) => response.json())
                            .then((data) => {
                            if (data)
                                Swal.fire("Asignacion", "Eliminada con Exito!", "success").then();
                            else
                                Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Datos erroneos",
                                })
                            })
                            .catch((error) => {
                            console.log(error);
                            });
        
                    }
                  });
            });
          
            }, 0); // Se utiliza un tiempo de espera mínimo de 0 para asegurar que el callback se ejecute después de que el DOM se haya actualizado.
          }
        mapAsignacionNadCol.forEach(procesarColegios);
    }
    async function getSelect(grupo) {
        // containerSelectPrueba.innerHTML = `<option selected>Seleccione una Prueba</option>`;
        containerSelectMetros.innerHTML = `<option selected>Seleccione los Metros</option>`;
        // containerSelectCompetencia.innerHTML = `<option selected>Seleccione la Competencia</option>`;
        // containerSelectInstitucion.innerHTML = `<option selected>Seleccione</option>`;
        // containerSelectGrupoCompetencias.innerHTML = `<option selected>Seleccione</option>`;
        const response = await fetch(`${rules.ip}/api/getSelect/${grupo}`);
        const array = await response.json();
        const mapMetros = array['mapMetros'].map(metros => ({ id: metros.id, nombre: metros.nombre }));
        mapMetros.forEach(metros => {
            containerSelectMetros.innerHTML += `<option value="${metros.nombre}">${metros.nombre}</option>`;
        });
        
    }
    getSelect(2);
    const submitHandler = async (event) => {
        const { target } = event;
        event.preventDefault();
        const dataForm = Object.fromEntries(new FormData(target));
        const handleResponse = (response) => {
            return response.json().then(data => {
                if (data) {
                    tiemposCompetencia.value=data;
                    // Swal.fire('Competencia', data, 'success').then((result) => {
                    //     if (result.isConfirmed) {
                    //     }
                    // });
                } else {
                    Swal.fire({ icon: 'error', title: 'Oops...', text: 'Datos erroneos' }).then((result) => {
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        };
        if (target.id === "formComparacion") {
            fetch(`${rules.ip}/api/getComparacion`, {
                method: "POST",
                body: JSON.stringify(dataForm),
                mode: "cors",
            }).then(handleResponse);
        } 
    };
    const changeHandler = async (event) => {
        const { target } = event;
        
        // if(target.id=="tipo_competencia"){
        //     const selectedKey = event.target.value;
        //     selectedArrayForm=selectArrayCompetencia[target.value]
        //     // console.log(selectedArrayForm)
        // }
        
    };
    const keyUpHandler = async (event) => {
        const { target } = event;
        if (target.value !== "" && target.id === "nadador") {
            const response = await fetch(`${rules.ip}/api/nadador/${target.value}`);
            const inst = await response.json();
            let elementList = "";
            const LIST = target.parentElement.children[1];
      
            if (inst !== "not found" && target.value!="") {
              inst.forEach(
                (nad) =>
                  (elementList += `
                    <li class='dropdown-item'name='itemNadador'" >${nad.nadador}</li>
                    <input type='hidden' value='${nad.cedula}' />
                    <input type='hidden' value='${nad.fecha_nacimiento}' />
                  `)
              );
              target.classList.add("show");
              LIST.classList.add("show");
              LIST.innerHTML = elementList;
            } else {
              LIST.classList.remove("show");
              LIST.innerHTML = "";
            }
          }
    };
    const buttonClickHandler = async (event) => {
        const { target } = event;
        // console.log(target.getAttribute("type"))
        
        if (target.getAttribute("type") === "button" && target.id.replace('btn', '')=="Escuela"&&target.parentElement.children[0].checked){
            // console.log(selectedArrayFormEscuela);
            crearEventoSeries(selectedArrayFormEscuela);
        }
        if (target.getAttribute("type") === "button" && target.id.replace('btn', '')=="Colegio"&&target.parentElement.children[0].checked){
            // console.log(target.id.replace('btn', ''));
            crearEventoSeries(selectedArrayFormColegio);
        }

        
        if (target.getAttribute("type") === "checkbox" &&
        target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id=="collapseCompetenciaEscuelas") {
            const cedula=target.parentElement.parentElement.children[0].innerText;
            const checkBox25PR_L = target.parentElement.parentElement.children[5].children[0].checked ? 1 : 0;
            const checkBox25PR_E=target.parentElement.parentElement.children[6].children[0].checked ? 1 : 0;
            const checkBox25Lib=target.parentElement.parentElement.children[7].children[0].checked ? 1 : 0;
            const checkBox25Esp=target.parentElement.parentElement.children[8].children[0].checked ? 1 : 0;
            const checkBox25Pech=target.parentElement.parentElement.children[9].children[0].checked ? 1 : 0;
            const checkBox25Mari=target.parentElement.parentElement.children[10].children[0].checked ? 1 : 0;
            const checkBox100CI=target.parentElement.parentElement.children[11].children[0].checked ? 1 : 0;
            const objConfigCheckBox = {
                PR_L: checkBox25PR_L,
                PR_E: checkBox25PR_E,
                Lib: checkBox25Lib,
                Esp: checkBox25Esp,
                Pech: checkBox25Pech,
                Mari: checkBox25Mari,
                CI: checkBox100CI
              };
            const arrayString = JSON.stringify(objConfigCheckBox);
            const objNadadorConfig = {
                cedula: cedula,
                arrayConfig: arrayString
              };
            
              fetch(`${rules.ip}/api/editConfigCheck`, {
                method: "POST",
                body: JSON.stringify(objNadadorConfig),
                mode: "cors",
            });
        }
        if (target.getAttribute("type") === "checkbox" &&
        target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id=="collapseCompetenciaColegios") {
            const cedula=target.parentElement.parentElement.children[0].innerText;
            const checkBox50Lib=target.parentElement.parentElement.children[5].children[0].checked ? 1 : 0;
            const checkBox50Esp=target.parentElement.parentElement.children[6].children[0].checked ? 1 : 0;
            const checkBox50Pech=target.parentElement.parentElement.children[7].children[0].checked ? 1 : 0;
            const checkBox50Mari=target.parentElement.parentElement.children[8].children[0].checked ? 1 : 0;
            const checkBox100CI=target.parentElement.parentElement.children[9].children[0].checked ? 1 : 0;
            const objConfigCheckBox = {
                Lib: checkBox50Lib,
                Esp: checkBox50Esp,
                Pech: checkBox50Pech,
                Mari: checkBox50Mari,
                CI: checkBox100CI
              };
            const arrayString = JSON.stringify(objConfigCheckBox);
            const objNadadorConfig = {
                cedula: cedula,
                arrayConfig: arrayString
              };
            
              fetch(`${rules.ip}/api/editConfigCheck`, {
                method: "POST",
                body: JSON.stringify(objNadadorConfig),
                mode: "cors",
            });


        }

        if (target.getAttribute("name") === "itemNadador" && target.tagName === "LI") {
            const input = target.parentElement.parentElement.children[0];
            const list = target.parentElement.parentElement.children[1];
            const elementList = target;
            const cedula=target.nextElementSibling.value;
            const fecha=target.nextElementSibling.nextElementSibling.value;
            const inputCedula = document.querySelector("#nadadorCedula");
            const inputFechaNacimiento = document.querySelector("#fechaNacimiento");
            inputCedula.value=cedula;
            // inputFechaNacimiento.value=fecha;

            input.value = elementList.innerText;
            list.classList.remove("show");
          } else {
            const uls = document.querySelectorAll(".dropdown-menu");
            const newUls = [...uls];
            const result = newUls.filter(
              (el) => el.id && el.className.includes("show")
            );
            if (result.length > 0)
              result.forEach((element) => element.classList.remove("show"));
          }

    };
    document.addEventListener('click', buttonClickHandler);
    document.addEventListener("submit", submitHandler);
    document.addEventListener("change", changeHandler);
    document.addEventListener("keyup", keyUpHandler);
    return;
}
