import Swal from "sweetalert2";

export const getDateNow = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  let string = `${day}-${month}-${year}`;
  return string;
};
export const inputsDisabled = ({ idContainer, true_false }) => {
  const container = document.getElementById(idContainer);

  const inputs = container.querySelectorAll('input[type="text"]');

  inputs.forEach((input) => {
    input.disabled = true_false;
  });
}
export const inputsAddTimes = ({ idContainer, data }) => {
  const container = document.getElementById(idContainer);
  inputsClear({ idContainer: "container_tiempos" });

  for (let index = 0; index < data.length; index++) {
    const input = document.getElementById(data[index]["prueba"]);
    if (input) {
      input.value = data[index]["tiempo"];
    }
  }


}

export function inputsClear(container) {
  const inputs = container.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.value = "";
  });
}
export function getSelects(obj) {
  const input = document.getElementById(obj.IdInput);
  const handleResponse = (response) => {
    return response.json().then(data => {
      if (data) {
        //   console.log(data)
        data.forEach(valor => {
          input.innerHTML += `<option value="${valor[0]}">${valor[1]}</option>`;
        });
      }
    })
  };
  if (input) {
    input.innerHTML = `<option selected>Seleccione una Opcion</option>`;

    const response = fetch(obj.Url, {
      method: "POST",
      body: JSON.stringify(obj.Array),
      mode: "cors",
    }).then(handleResponse);
  }
}
export const getDate = (fecha) => {

  var array = fecha.split('-');

  let string = `${array[2]}-${array[1]}-${array[0]}`

  return string;
};
export function saveData(obj) {
  const form = document.getElementById(obj.IdForm);
  const handleResponse = (response) => {
    return response.json().then(data => {
      if (data) {
        Swal.fire({ icon: data["icon"], title: data["title"], text: data["text"], }).then((result) => {
          if (result.isConfirmed) {
            if (obj.TableAjax) {
              obj.TableAjax.ajax.reload();
            }
            if (form) inputsClear(form)
          }
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Datos erroneos' }).then((result) => {
        });
      }
    }).catch(error => {
      console.log(error);
    });
  };
  form.addEventListener('submit', function (event) {
    const { target } = event;
    event.preventDefault();
    const dataForm = Object.fromEntries(new FormData(target));
    const array = {
      Table: obj.Table,
      Columns: dataForm,
    }
    // console.log(dataForm)

    if (dataForm.fecha) {
      dataForm.fecha = getDate(dataForm.fecha);
      // console.log(dataForm.fecha)
    }

    fetch(obj.Url, {
      method: "POST",
      body: JSON.stringify(array),
      mode: "cors",
    }).then(handleResponse);
  });
}
export function editData(obj) {
  // const form = document.getElementById(obj.IdForm);
  const handleResponse = (response) => {
    return response.json().then(data => {
      if (obj.TableAjax) {
        if (data) {
          Swal.fire({ icon: data["icon"], title: data["title"], text: data["text"], }).then((result) => {
            if (result.isConfirmed) {
              if (obj.TableAjax) {
                obj.TableAjax.ajax.reload();
              }

              // console.log(data)
              // if(data["form"])limpiarInputs(document.getElementById(data["form"]))

              // if(data["modal"]){
              //   const modal = document.getElementById(data["modal"]);
              //   $(modal).modal('hide');
              // }
            }
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'Datos erroneos' }).then((result) => {
          });
        }
      }

    }).catch(error => {
      console.log(error);
    });
  };
  // form.addEventListener('submit', function(event) {
  // const { target } = event;
  // event.preventDefault();
  // const dataForm = Object.fromEntries(new FormData(target));
  fetch(obj.Url, {
    method: "POST",
    body: JSON.stringify(obj.Array),
    mode: "cors",
  }).then(handleResponse);
  // });


}
export function deleteData(obj) {
  // const form = document.getElementById(obj.IdForm);
  const handleResponse = (response) => {
    return response.json().then(data => {
      if (data) {
        Swal.fire({ icon: data["icon"], title: data["title"], text: data["text"], }).then((result) => {
          if (result.isConfirmed) {
            if (obj.TableAjax) {
              obj.TableAjax.ajax.reload();
            }
          }
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Datos erroneos' }).then((result) => {
        });
      }
    }).catch(error => {
      console.log(error);
    });
  };
  fetch(obj.Url, {
    method: "POST",
    body: JSON.stringify(obj.Array),
    mode: "cors",
  }).then(handleResponse);
}
export function inputsNumberToTime(input) {
  // Agregar un listener al evento de cambio en el select
  // input.addEventListener('change', function (event) {
    let valor = input.value;
    let dig1 = Number(valor.charAt(0));
    let dig2 = Number(valor.charAt(1));
    let dig3 = Number(valor.charAt(2));
    let dig4 = Number(valor.charAt(3));
    let dig5 = Number(valor.charAt(4));
    let dig6 = Number(valor.charAt(5));
    let dig7 = Number(valor.charAt(6));
    let dig8 = Number(valor.charAt(7));
    if (valor != 0 && valor.length == 1 && !isNaN(valor)) input.value = `00:00:00,0${valor}`;
    else if (valor != 0 && valor.length == 2 && !isNaN(valor)) input.value = `00:00:00,${valor}`;
    else if (valor != 0 && valor.length == 3 && !isNaN(valor)) input.value = `00:00:0${dig1},${dig2}${dig3}`;
    else if (valor != 0 && valor.length == 4 && !isNaN(valor)) input.value = `00:00:${dig1}${dig2},${dig3}${dig4}`;
    else if (valor != 0 && valor.length == 5 && !isNaN(valor)) input.value = `00:0${dig1}:${dig2}${dig3},${dig4}${dig5}`;
    else if (valor != 0 && valor.length == 6 && !isNaN(valor)) input.value = `00:${dig1}${dig2}:${dig3}${dig4},${dig5}${dig6}`;
    else if (valor != 0 && valor.length == 7 && !isNaN(valor)) input.value = `0${dig1}:${dig2}${dig3}:${dig4}${dig5},${dig6}${dig7}`;
    else if (valor != 0 && valor.length == 8 && !isNaN(valor)) input.value = `${dig1}${dig2}:${dig3}${dig4}:${dig5}${dig6},${dig7}${dig8}`;
    else input.value = "";
  // });
};
export function inputsTimeToNumber(input) {
  input.addEventListener('click', function (event) {
    let valor = input.value;
    if (valor != "" && isNaN(valor)) {
      let hms = valor.split(":");
      let mls = hms[2].split(",");
      if (parseInt(hms[0]) != 0) input.value = `${hms[0]}${hms[1]}${mls[0]}${mls[1]}`;
      else if (parseInt(hms[1]) != 0) input.value = `${parseInt(hms[1])}${mls[0]}${mls[1]}`;
      else if (parseInt(mls[0]) != 0) input.value = `${parseInt(mls[0])}${mls[1]}`;
      else if (parseInt(mls[1]) != 0) input.value = `${parseInt(mls[1])}`;
      else input.value = "";
    }
  });


};
export function inputsSoloNumeros(input) {
  input.addEventListener('keydown', function (event) {
    if (!/^[0-9]$/.test(event.key) && event.keyCode !== 8) {
      event.preventDefault();
    }
  });

};
export function ejecutar(obj) {
  const button = document.getElementById(obj.IdInput);
  const handleResponse = (response) => {
    return response.json().then(data => {
      if (data) {
        Swal.fire({ icon: data["icon"], title: data["title"], text: data["text"], }).then((result) => {
          if (result.isConfirmed) {

          }
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Datos erroneos' }).then((result) => {
        });
      }
    }).catch(error => {
      console.log(error);
    });
  };

  button.addEventListener('click', function (event) {
    fetch(obj.Url, {
      method: "POST",
      body: JSON.stringify(obj.Array),
      mode: "cors",
    }).then(handleResponse);
  });


}
export function createModal(obj) {
  const container = document.getElementById(obj.IdContainer);
  let contenedor = ``;
  contenedor += `
    <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
        data-bs-target="#${obj.IdModal}">
        ${obj.TittleModal}
    </button>
    <div class="modal fade" id="${obj.IdModal}" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ModalLabel">${obj.TittleModal}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="form_${obj.IdModal}">
                  <div class="modal-body">`;
  Object.keys(obj.ArrayInputs).forEach(key => {
    const value = obj.ArrayInputs[key];
    // console.log(`Key: ${key}, Value: ${value.Type}`);
    if (value.Type == "text" || value.Type == "date") {
      contenedor += `
                        <div class="input-group mt-3">
                          <span class="input-group-text">${value.Text}</span>
                          <div class="form-floating w-50">
                              <input type="${value.Type}" class="form-control" name="${key}" id="${key}" autocomplete="off"/>
                          </div>
                        </div>
                        `;
    }
    if (value.Type == "select") {
      contenedor += `
                          <div class="input-group mt-3">
                            <span class="input-group-text">${value.Text}</span>
                            <div class="form-floating w-50">
                                <select class="form-select" id="${key}" name="${key}">
                                    <option selected>Seleccione una opcion</option>
                                </select>
                            </div>
                          </div>
                        `;
    }

  });

  contenedor += `</div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                  </div>
                </form>
            </div>
        </div>
    </div>
`;


  container.innerHTML += contenedor;
  return container;

}


export function getCompentencia(obj) {
  const container = document.getElementById(obj.IdContainer);
  container.innerHTML=``
  let contenedor = ``;
  if (obj != null) {

    // const array = Object.entries(obj.array);
    console.log(obj.Eventos)
    let cont=0;

    contenedor += `<table class="table">`;


    obj.Eventos.forEach(function (competencia, indice,array) {
      if(indice==0){
        // contenedor += `<div class="row">`;
      }

      if(indice%2===0){
        contenedor += `<tr><td>`;
      }else{
        contenedor += `<td>`;
      }
      // <div class="col-6">
      contenedor += `
              <table class="table">
                  <thead>
                    <tr>
                      <th scope="col" class="col">Evento${indice + 1}</th>
                      <th scope="col" class="col">${competencia.Prueba}</th>
                      <th scope="col" class="col">Cat:</th>
                      <th scope="col" class="col">${competencia.Categoria}</th>
                      <th scope="col" class="col">${competencia.Genero}</th>`;
                      if(obj.IngresoTiempos){
                        contenedor += `
                          <th scope="col" class="col"></th>
                      `;
                      }contenedor += `
                    </tr>
                    <tr>
                        <th scope="col" class="col">Carril</th>
                        <th scope="col" class="col">Nadador</th>
                        <th scope="col" class="col">Institucion</th>
                        <th scope="col" class="col">Tiempo</th>
                        <th scope="col" class="col">N</th>`;
                        if(obj.IngresoTiempos){
                          contenedor += `
                            <th scope="col" class="col">Desc</th>
                        `;
                        }contenedor += `
                        
                    </tr>
                  </thead>
                  <tbody id="competencia${indice}">`;
                    competencia.Series.forEach(function (serie, index) {
                        contenedor += `
                    <tr>
                        <td scope="col" class="col text-center" colspan="7">Serie${index+1}</td>
                            `;
                          serie.Nadadores.forEach(function (nad, indexNad) {

                            
                              let lugar="";
                              let descalificadoChecked="";
                              let premiadoChecked="";
                              if(nad.lugar!=0 && nad.lugar){
                                  // lugar=nad.lugar;
                                  

                                 
                              }
                              if(nad.descalificado==1){
                                  descalificadoChecked="checked";
                              }
                              if(nad.premiado==1){
                                  premiadoChecked="checked";
                              }
                              contenedor += `

                                <tr>
                                    <td scope="col" class="col">${serie.Nadadores.length<=3?indexNad+2:indexNad+1}</td>
                                    <td scope="col" class="col">${nad.nadador}</td>
                                    <td scope="col" class="col">${nad.entidad}</td>
                                    <td scope="col" class="col">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        autocomplete="off"
                                        maxlength="8"
                                        name="tiempo${nad.id}"
                                        id="tiempo${nad.id}"
                                        value="${nad.tiempo}"
                                    >
                                    </td>

                                    <td scope="col" class="col">
                                    ${lugar}
                                    </td>`;
                                    if(obj.IngresoTiempos){
                                      contenedor += `
                                      <td scope="col" class="col">
                                              <input 
                                              class="form-check-input" 
                                              type="checkbox" 
                                              id="descalificado${nad.id}" 
                                              ${descalificadoChecked}
                                              />
                                      </td>
                                  
                                    `;
                                    }contenedor += `

                                  
                                </tr>

                                                    `;
                        });
                        contenedor += `</tr>`;
                    });
                      contenedor += 
                      `</tbody>
                      
                      </table>`
                      // </div>`;
                      if(indice%2!==0){
                        contenedor += `</td></tr>`;
                      }else{
                        contenedor += `</td>`;
                      }
                      cont++;
    });
    // contenedor += `</div>`;

    contenedor += `</table>`;

  }
  container.innerHTML += contenedor;

  return container;
}
export function administracionPruebas(obj) {
  const container = document.getElementById(obj.IdContainer);
  container.innerHTML= ``;

  let contenedor = ``;
    // const array = Object.entries(obj.array);
    // console.log(obj.Entidad)
    obj.Entidad.forEach(function (entidad, indice,array) {
      contenedor += 
      `<div class="card shadow rounded" >
        <h6 class="card-header rounded">
              <a class="nav-link dropdown-toggle p-0" data-bs-toggle="collapse" 
                aria-controls="collapseCompetencia${entidad.Id}" role="button" 
                href="#collapseCompetencia${entidad.Id}">
                ${indice+1}.- ${entidad.Nombre}
              </a>
        </h6>

        <div  class="collapse" id="collapseCompetencia${entidad.Id}">

        
            <div class="card shadow rounded" >
              <div class="table-responsive">
                  <table class="table">
                      <thead>
                        <tr>
                          <th scope="col" class="col">#</th>
                          <th scope="col" class="col">Nadador</th>
                          <th scope="col" class="col">Categoria</th>
                          <th scope="col" class="col">PR_L</th>
                          <th scope="col" class="col">PR_E</th>
                          <th scope="col" class="col">25Lib</th>
                          <th scope="col" class="col">25Esp</th>
                          <th scope="col" class="col">25Pech</th>
                          <th scope="col" class="col">25Mari</th>
                          <th scope="col" class="col">50Lib</th>
                          <th scope="col" class="col">50Esp</th>
                          <th scope="col" class="col">50Pech</th>
                          <th scope="col" class="col">50Mari</th>
                          <th scope="col" class="col">100CI</th>
                        </tr>
                      </thead>
                      <tbody>
                        `;
                        entidad.Nadadores.forEach(function (nad, indice,array) {
                          // console.log(nad.ArrayChecks)

                          contenedor += `
                            <tr>
                              <input type="hidden" value="${nad.Id}"/>

                              <td scope="col" class="col">${indice+1}</td>
                              <td scope="col" class="col">${nad.Nadador}</td>
                              <td scope="col" class="col">${nad.Categoria}</td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="PR_L" type="checkbox" ${nad.ArrayChecks.PR_L}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="PR_E" type="checkbox" ${nad.ArrayChecks.PR_E}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Libre25" type="checkbox" ${nad.ArrayChecks.Libre25}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Espalda25" type="checkbox" ${nad.ArrayChecks.Espalda25}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Pecho25" type="checkbox" ${nad.ArrayChecks.Pecho25}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Mariposa25" type="checkbox" ${nad.ArrayChecks.Mariposa25}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Libre50" type="checkbox" ${nad.ArrayChecks.Libre50}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Espalda50" type="checkbox" ${nad.ArrayChecks.Espalda50}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Pecho50" type="checkbox" ${nad.ArrayChecks.Pecho50}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="Mariposa50" type="checkbox" ${nad.ArrayChecks.Mariposa50}/>
                              </td>
                              <td scope="col" class="col">
                                <input class="form-check-input" name="CI100" type="checkbox" ${nad.ArrayChecks.CI100}/>
                              </td>
                              
                            </tr>
                          `
                        });
                          contenedor += `
                      </tbody>
                  </table>
              </div>
            </div>
            `;

        contenedor += `</div>
      </div>
     
        `;
    });
  container.innerHTML += contenedor;

  return container;
}

export async function getEntidadesCompetencia(obj) {
  const response = await fetch(obj.Url, {
    method: "POST",
    body: JSON.stringify(obj.Opciones),
    mode: "cors",
  })

  const array = await response.json();
  return array

}



export async function getRecords(obj) {

  const response = await fetch(obj.Url, {
    method: "POST",
    body: JSON.stringify(obj.Array),
    mode: "cors",
  })

  const array = await response.json();
  return array
}
export function login(obj) {
  const form = document.getElementById(obj.IdForm);
  const handleResponse = (response) => {
    return response.json().then(data => {
      if (data) {
        Swal.fire({ icon: data["icon"], title: data["title"], text: data["text"], }).then((result) => {
          if (result.isConfirmed) {
            if (form) inputsClear(form)
          }
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Datos erroneos' }).then((result) => {
        });
      }
    }).catch(error => {
      console.log(error);
    });
  };
  
  form.addEventListener('submit', function (event) {
    const { target } = event;
    event.preventDefault();
    const dataForm = Object.fromEntries(new FormData(target));

    fetch(obj.Url, {
      method: "POST",
      body: JSON.stringify(dataForm),
      mode: "cors",
    }).then(handleResponse);
  });
}

export async function getGanador(obj) {
  const response = await fetch(obj.Url, {
    method: "POST",
    body: JSON.stringify(obj.Opciones),
    mode: "cors",
  })

  const array = await response.json();

  
  const container = document.getElementById(obj.IdContainer);
  container.innerHTML= ``;
  console.log(array)

  let contenedor = ``;
    array.forEach(function (entidad, indice,array) {
      contenedor += 
      `<div class="card shadow rounded" >
        <h6 class="card-header rounded">
              <a class="nav-link dropdown-toggle p-0" data-bs-toggle="collapse" 
                aria-controls="collapseCompetencia${entidad.Id}" role="button" 
                href="#collapseCompetencia${entidad.Id}">
                ${entidad.Nombre}
              </a>
        </h6>

        <div  class="collapse" id="collapseCompetencia${entidad.Id}">

        
            <div class="card shadow rounded" >
              <div class="table-responsive">
                  <table class="table">
                      <thead>
                        <tr>
                          <th scope="col" class="col">#</th>
                          <th scope="col" class="col">Medallas de Oro</th>
                          <th scope="col" class="col">Medallas de Plata</th>
                          <th scope="col" class="col">Medallas de Bronce</th>
                        </tr>
                      </thead>
                      <tbody>
                       
                      </tbody>
                  </table>
              </div>
            </div>
            `;

        contenedor += `</div>
      </div>
     
        `;
    });
  container.innerHTML += contenedor;

  return container;
}
export async function getResultados(obj) {
  const response = await fetch(obj.Url, {
    method: "POST",
    body: JSON.stringify(obj.Opciones),
    mode: "cors",
  })

  const array = await response.json();

  
  const container = document.getElementById(obj.IdContainer);
  container.innerHTML= ``;
  console.log(array)
  let contenedor = ``;

    contenedor += 
    `<div class="card shadow rounded" >
      <h6 class="card-header rounded">
            <a class="nav-link dropdown-toggle p-0" data-bs-toggle="collapse" 
              aria-controls="resultadosCompetenciaGanador" role="button" 
              href="#resultadosCompetenciaGanador">
              Resultados ${array.Nombre}
            </a>
      </h6>

      <div  class="collapse" id="resultadosCompetenciaGanador">

      
          <div class="card shadow rounded" >
            <div class="table-responsive">
                <table class="table">
                    <thead>
                      <tr>
                        <th scope="col" class="col">#</th>
                        <th scope="col" class="col">Entidad</th>
                        <th scope="col" class="col">Medallas de Oro</th>
                        <th scope="col" class="col">Medallas de Plata</th>
                        <th scope="col" class="col">Medallas de Bronce</th>
                        <th scope="col" class="col">Total de Medallas</th>
                      </tr>
                    </thead>
                    <tbody>
                      `;
                      const TotalMedallas={Oro:0,Plata:0,Bronce:0,Total:0}
                      array["Resultados"].forEach(function (entidad, indice,array) {
                        TotalMedallas.Oro+=entidad.Medallas.Oro
                        TotalMedallas.Plata+=entidad.Medallas.Plata
                        TotalMedallas.Bronce+=entidad.Medallas.Bronce
                        TotalMedallas.Total+=entidad.Medallas.Total

                        contenedor +=`
                        <tr>
                          <td scope="col" class="col">${indice+1}</td>
                          <td scope="col" class="col">${entidad.Entidad}</td>
                          <td scope="col" class="col">${entidad.Medallas.Oro}</td>
                          <td scope="col" class="col">${entidad.Medallas.Plata}</td>
                          <td scope="col" class="col">${entidad.Medallas.Bronce}</td>
                          <td scope="col" class="col">${entidad.Medallas.Total}</td>
                        </tr>
                       
                        `; 
                      });
                  
                        contenedor += `
                        <tr>
                          <td scope="col" class="col"></td>
                          <td scope="col" class="col">TOTAL DE MEDALLAS</td>
                          <td scope="col" class="col">${TotalMedallas.Oro}</td>
                          <td scope="col" class="col">${TotalMedallas.Plata}</td>
                          <td scope="col" class="col">${TotalMedallas.Bronce}</td>
                          <td scope="col" class="col">${TotalMedallas.Total}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
          </div>
          `;

      contenedor += `</div>
    </div>
   
      `;

  array["Competencia"].forEach(function (competencia, indice,array) {
    contenedor += `
      <div class="card mx-3 mt-3 shadow rounded" >
        <div class="table-responsive">
            <table class="table">
                <thead>
                  <tr>
                    <th scope="col" colspan='5' class="col text-center">Evento #${competencia.Numero} ${competencia.Prueba} Categoria ${competencia.Categoria} ${competencia.Genero='F'?'Femenino':'Masculino'}</th>
                  </tr>
                  <tr>
                      <th scope="col" class="col">Puesto</th>
                      <th scope="col" class="col">Nadador</th>
                      <th scope="col" class="col">Entidad</th>
                      <th scope="col" class="col">Tiempo</th>
                      <th scope="col" class="col">Desc</th>
                  </tr>
                </thead>
                <tbody id="competencia${indice}">`;
                  competencia.Nadadores.forEach(function (nad, index) {
                      contenedor += `
                  <tr>
                      <td scope="col" class="col">${nad.descalificado==1?index+1:nad.lugar}</td>
                      <td scope="col" class="col">${nad.nadador}</td>
                      <td scope="col" class="col">${nad.entidad}</td>
                      <td scope="col" class="col">${nad.tiempo}</td>
                      <td scope="col" class="col">${nad.descalificado==1?'Descalificado':''}</td>
                  </tr>
                      `;
                      });

                    contenedor += 
                    `</tbody>
                    
            </table>
        </div>
      </div>
      `;
  });
  container.innerHTML += contenedor;

  return container;
}





