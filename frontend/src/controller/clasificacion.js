import clasificacion from "../view/clasificacion.html?raw";
import { rules } from "../rules/rules.js";
import DataTable from "datatables.net-bs5";
import Swal from "sweetalert2";
import {createModal} from "../helpers/functions.js";



export default async () => {
  const mainContainer = document.querySelector("#root");
  mainContainer.innerHTML = clasificacion;
  
  
  const containerTable = document.querySelector("#containerTable");
  const prueba = document.querySelector("#prueba");
  const metros = document.querySelector("#metros");
  const btnStop = document.querySelector("#btnStop");

  let onoff=true

  let arrayPruebas=[
    // "10Pruebas",
    // "12 Pruebas",
    "Libre",
    "Espalda",
    "Pecho",
    "Mariposa",
    // "CI",
    // "BR_L",
    // "BR_E",
    // "BR_P",
    // "BR_M",
    // "PR_L",
    // "PR_E",
    // "PR_P",
    // "PR_M",
  ]
  let arrayMetros=[
    "500 Metros",
    "200 Metros",
    // "1000 Metros",
    // "2000 Metros",
  ]
  let contadorPruebas=0
  let contadorMetros=0

  
  
    
  function updateTableData() {
   if(onoff){ let obj={
      Table:`tiempos INNER JOIN nadador ON nadador.cedula=tiempos.cedula `,
      Columns:[`tiempos.*`,`MIN(tiempos.tiempo) AS tiempo`,`Concat(nadador.nombres,' ',nadador.apellidos)AS nadador`],
      Conditions:{
        prueba:arrayPruebas[contadorPruebas],
        metros:arrayMetros[contadorMetros],
      },
      GroupBy:"nadador,tiempos.prueba,tiempos.metros",
      OrderBy:"tiempo ASC",
    }

    prueba.innerText=arrayPruebas[contadorPruebas]
    metros.innerText=arrayMetros[contadorMetros]


    
    
    if(contadorPruebas+1==arrayPruebas.length){
      contadorPruebas=0
      contadorMetros++
    }
    else{
      // console.log(contadorMetros)
      contadorPruebas++
    } 


    if(contadorMetros==arrayMetros.length ){
      contadorMetros=0
    }
    // else{
    //   contadorMetros=0
    // } 

    containerTable.innerHTML=``

    let table = document.createElement("table");
    table.classList="table table-borderless caption-top table-hover "
    table.id="dataTable"
    table.innerHTML=` <thead class="table-dark"></thead>`
    containerTable.appendChild(table)

      new DataTable("#dataTable", {
        ajax: {
          responsive: true,
          url: `${rules.ip}/getTable`,
          dataSrc: "",
          data: {
            data: JSON.stringify(obj)
          },
          type:"POST",
          dataType: "JSON",
        },
        
        dom: 't',
        pageLength: 100,
        columns: [
          { title: "#", data: null, render: function (data, type, row, meta) {return meta.row + 1;}},
          { title: "Nadador", data: "nadador"},
          { title: "Fecha", data: "fecha"},
          { title: "tiempo", data: "tiempo"},
        ],
        
      });}
  }


  updateTableData()
  setInterval(updateTableData, 10000);

  btnStop.addEventListener('click', function() {
    if(onoff){
      onoff=false
      btnStop.innerHTML="Reproducir"
    }else{
      onoff=true
      btnStop.innerHTML="Parar"
    }
});


  return;
};