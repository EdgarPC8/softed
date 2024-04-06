
import { rules } from "../rules/rules.js";
import times from "../view/times.html?raw";
import DataTable from "datatables.net-bs5";
import Swal from "sweetalert2";

import { inputsNumberToTime,inputsTimeToNumber, inputsSoloNumeros, getDateNow ,inputsDisabled, inputsAddTimes,inputsClear,editData,getSelects,saveData,deleteData,createModal} from "../helpers/functions.js";

export default async () => {
    const mainContainer = document.querySelector("#root");
    mainContainer.innerHTML = times;
    let table;

    // document.querySelector("#fecha").value=getDateNow();
    table = new DataTable("#dataTable", {
      ajax: {
        responsive: true,
        url: `${rules.ip}/getTable`,
        dataSrc: "",
        data: {
          data: JSON.stringify({
            Table:`tiempos INNER JOIN nadador ON nadador.cedula=tiempos.cedula `,
            Columns:[`tiempos.*`,`Concat(nadador.nombres,' ',nadador.apellidos)AS nadador`],
            Conditions:{},
            GroupBy:null,
            OrderBy:"id DESC",
          })
        },
        type:"POST",
        dataType: "JSON",
      },
      columns: [
        { title: "#", data: null, render: function (data, type, row, meta) {return meta.row + 1;}},
        { title: "Cedula", data: "cedula"},
        { title: "Nadador", data: "nadador"},
        { title: "Fecha", data: "fecha"},
        { title: "Prueba", data: "prueba"},
        { title: "Metros", data: "metros"},
        { title: "tiempo", data: "tiempo"},
        { title: "accion", 
          data: null,
          render: function (data, type, row) {
            return `
                        <button class="ml-2 btn btn-warning" id="btn_edit">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger" id="btn_delete">
                          <i class="bi bi-trash-fill"></i>
                        </button>
                        `;
          },
          createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
            cell
              .querySelector("#btn_delete")
              .addEventListener("click", function () {
                  Swal.fire({
                  title: "Eliminar",
                  text: "¿Estás seguro que deseas ejecutar la accion?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#dc3545",
                  confirmButtonText: "Sí, confirmar",
                  cancelButtonText: "Cancelar",
                }).then((result) => {
                  if (result.isConfirmed) {
                    deleteData({
                      Url:`${rules.ip}/deleteData`,
                      TableAjax:table,
                      Array:{
                        Table:"tiempos",
                        Conditions:{
                          id:cellData["id"],
                        },
                      },
                      
                    });
                  }
                });
              });
  
            cell
              .querySelector("#btn_edit")
              .addEventListener("click", function (event) {
                const { target } = event;
                let btnEditar=cell.children[0];
                let btnEliminar=cell.children[1];
                
                btnEditar.style.display = "none";
                btnEliminar.style.display = "none";
                if (!document.getElementById(`btnCancelar${cellData.id}`)&&!document.getElementById(`btnCancelar${cellData.id}`)) {
                  // console.log(cell.parentElement.children[6])

                  cell.parentElement.children[6].innerHTML=`<input style="width:105px;" type="text" class="form-control"value="${cellData["tiempo"]}"/>`;
                  cell.parentElement.children[5].innerHTML=`<input style="width:105px;" type="text" class="form-control"value="${cellData["metros"]}"/>`;
                  cell.parentElement.children[4].innerHTML=`<input style="width:105px;" type="text" class="form-control"value="${cellData["prueba"]}"/>`;
                  cell.parentElement.children[3].innerHTML=`<input style="width:105px;" type="text" class="form-control"value="${cellData["fecha"]}"/>`;
                  const inputTime=cell.parentElement.children[6].children[0];
                  const inputMetros=cell.parentElement.children[5].children[0];
                  const inputPrueba=cell.parentElement.children[4].children[0];
                  const inputFecha=cell.parentElement.children[3].children[0];
                  inputsNumberToTime(inputTime);
                  inputsSoloNumeros(inputTime);
                  inputsTimeToNumber(inputTime);
                  const btnCancelar = document.createElement("button");
                  btnCancelar.className=" btn btn-danger";
                  btnCancelar.innerHTML=`<i class="bi bi-x"></i>`;
                  btnCancelar.id=`btnCancelar${cellData.id}`;
                  btnCancelar.addEventListener("click", function() {
                    cell.parentElement.children[6].innerHTML=`<td>${cellData["tiempo"]}<td/>`;
                    cell.parentElement.children[5].innerHTML=`<td>${cellData["metros"]}<td/>`;
                    cell.parentElement.children[4].innerHTML=`<td>${cellData["prueba"]}<td/>`;
                    cell.parentElement.children[3].innerHTML=`<td>${cellData["fecha"]}<td/>`;
                    btnEditar.style.display = "";
                    btnEliminar.style.display = "";
                    btnCancelar.remove();
                    btnConfirmar.remove();

                  });
                  const btnConfirmar = document.createElement("button");
                  btnConfirmar.className=" btn btn-success";
                  btnConfirmar.innerHTML=`<i class="bi bi-check2"></i>`;
                  btnConfirmar.id=`btnConfirmar${cellData.id}`;
                  btnConfirmar.addEventListener("click", function() {
                    editData({
                      Url:`${rules.ip}/editData`,
                      TableAjax:table,
                      Array:{
                        Table:"tiempos",
                        Columns:{
                            tiempo:inputTime.value,
                            metros:inputMetros.value,
                            prueba:inputPrueba.value,
                            fecha:inputFecha.value,
                        },
                        Conditions:{
                          id:cellData["id"],
                        },
                      },
                      
                    });
                  });

                cell.appendChild(btnConfirmar);
                cell.appendChild(btnCancelar);
                }
                
              });
          },
        },
      ],
    });
    createModal({
      IdContainer:`container`,
      TittleModal:`Agregar Tiempo`,
      IdModal:`addTime`,
      ArrayInputs:{
        cedula:{
          Text:`Cedula`,
          Type:`select`,
        },
        fecha:{
          Text:`Fecha`,
          Type:`date`,
        },    
        metros:{
          Text:`Metros`,
          Type:`select`,
        },  
        prueba:{
          Text:`Prueba`,
          Type:`select`,
        },  
        tiempo:{
          Text:`Tiempo`,
          Type:`text`,
        },    
      },
    });
    getSelects({
        Url:`${rules.ip}/getSelects`,
        IdInput:`cedula`,
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
    getSelects({
        Url:`${rules.ip}/getSelects`,
        IdInput:`prueba`,
        Array:{
            Table:`pruebas`,
            Columns:[`nombre`,`nombre`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });
    inputsSoloNumeros(document.getElementById("tiempo"));
    inputsNumberToTime(document.getElementById("tiempo"));
    inputsTimeToNumber(document.getElementById("tiempo"));

    saveData({
        Url:`${rules.ip}/saveData`,
        IdForm:`form_addTime`,
        TableAjax:table,
        Table:`tiempos`,
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
