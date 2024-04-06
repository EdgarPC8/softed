import { rules } from "../rules/rules.js";
import competencia from "../view/competencia.html?raw";
import Swal from "sweetalert2";


import { createModal,getSelects,administracionPruebas,getEntidadesCompetencia,getCompentencia,saveData,editData } from "../helpers/functions.js";


export default async () => {
    const mainContainer = document.querySelector("#root");
    mainContainer.innerHTML = competencia;
    const containerPruebas = document.querySelector("#containerPruebas");

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
    createModal({
        IdContainer: `container_add`,
        TittleModal: `Agregar Competencia`,
        IdModal: `addComp`,
        ArrayInputs: {
            nombre: {
                Text: `Nombre`,
                Type: `text`,
            },
            fecha: {
                Text: `Fecha`,
                Type: `date`,
            },
        },
    });
    createModal({
        IdContainer: `container_add`,
        TittleModal: `Agregar Institucion`,
        IdModal: `addInst`,
        ArrayInputs: {
            nombre: {
                Text: `Nombre`,
                Type: `text`,
            },
        },
    });
    createModal({
        IdContainer: `container_add`,
        TittleModal: `Añadir nadador`,
        IdModal: `addNad`,
        ArrayInputs: {
            cedula: {
                Text: `Cedula`,
                Type: `text`,
            },
            fecha_nacimiento: {
                Text: `Fecha de Nacimiento`,
                Type: `date`,
            },
            genero: {
                Text: `Genero`,
                Type: `select`,
            },
            grupo: {
                Text: `Grupo`,
                Type: `select`,
            },
            nombres1: {
                Text: `Primer Nombre`,
                Type: `text`,
            },
            nombres2: {
                Text: `Segundo Nombre`,
                Type: `text`,
            },
            apellidos1: {
                Text: `Primer Apellido`,
                Type: `text`,
            },
            apellidos2: {
                Text: `Segundo Apellido`,
                Type: `text`,
            },
        },
    });
    createModal({
        IdContainer: `container_add`,
        TittleModal: `Asignacion Institucion`,
        IdModal: `addAsgNAd`,
        ArrayInputs: {
            id_institucion: {
                Text: `Institucion`,
                Type: `select`,
            },
            nivel: {
                Text: `Nivel`,
                Type: `select`,
            },
            categoria: {
                Text: `Categorias`,
                Type: `select`,
            },
        },
    });
    saveData({
        Url:`${rules.ip}/saveData`,
        IdForm:`form_addComp`,
        TableAjax:null,
        Table:`competencia`,
        Array:{
            Table:`competencia`,
            Columns:[`id`,`nombre`],
            Conditions:{},
            GroupBy:null,
            OrderBy:null,
        },
    });

    console.log(await getEntidadesCompetencia({Url:`${rules.ip}/administrarCompetencia`,Opciones:{Create:false,IdCompetencia:3}}))


    const changeHandler = async (event) => {
        const { target } = event;
        if (target.id == "selectCompetencia" && target.value != "Seleccione una Opcion") {
            administracionPruebas({IdContainer:`containerPruebas`,Entidad:await getEntidadesCompetencia({Url:`${rules.ip}/getEntidadCompetencia`,Opciones:{Create:false,IdCompetencia:target.value}})});
            if (document.querySelector("#createCompetencia").checked) {

                 Swal.fire({
                  title: "Crear",
                  text: "¿Estás seguro que deseas crear la Competencia?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#dc3545",
                  confirmButtonText: "Sí, confirmar",
                  cancelButtonText: "Cancelar",
                }).then(async (result) => {
                  if (result.isConfirmed) {

                    getCompentencia({
                        IdContainer:`container_competencias`,
                        Eventos:await  getEntidadesCompetencia({Url:`${rules.ip}/administrarCompetencia`,Opciones:{Create:true,IdCompetencia:target.value}})
                    });
                  }
                });
             
               
            }else{
                getCompentencia({
                    IdContainer:`container_competencias`,
                    Eventos:await getEntidadesCompetencia({Url:`${rules.ip}/administrarCompetencia`,Opciones:{Create:false,IdCompetencia:target.value}})
                });

            }

        }
        
        if (target.type == "checkbox" && target.id!="createCompetencia") {
            let Id=target.parentElement.parentElement.children[0].value;
            var fila = target.parentElement.parentElement
            var checkboxes = fila.querySelectorAll('input[type="checkbox"]');
            var valores = {};
            checkboxes.forEach(function(checkbox) {
                valores[checkbox.name] = checkbox.checked ? "checked" : "";
            });
            editData({
                Url:`${rules.ip}/editData`,
                TableAjax:null,
                Array:{
                  Table:"institucion_nadador",
                  Columns:{
                      configCheck:JSON.stringify(valores),
                  },
                  Conditions:{
                    id:Id,
                  },
                },
                
              });
        }

    };
    document.addEventListener("change", changeHandler);

    


    return;
}
