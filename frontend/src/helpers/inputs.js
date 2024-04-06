import {createPopover,onChangeValueSelect,isValidCI} from "./functions.js";

export const clearInputs = ({ idAttribute }) => {
  const container = document.getElementById(idAttribute);

  const inputs = container.querySelectorAll(
    'input[type="text"],input[type="checkbox"],input[type="date"], select, textarea'
  );
  inputs.forEach((input) => {
    if (input.type === "checkbox") {
      input.checked = false;
    } else {
      if (input.id != "admission_date") {
        input.value = "";
      }
      if (input.matches("#options_sex") || input.matches("#civil_status")) {
        input.value = input.options[0].value;
      }
    }
  });
}
export const clearRemoveAtributteInputs = ({ idAttribute }) => {
  const container = document.getElementById(idAttribute);

  const inputs = container.querySelectorAll(
    'input[type="text"],input[type="date"], select, textarea'
  );

  inputs.forEach((input) => {
    if (input.id != "admission_date" && input.id!="measurement_date") {
      input.value = "";
      input.removeAttribute("disabled","");
    }
    
    
    if (input.matches("#options_sex") || input.matches("#civil_status")) {
      input.value = input.options[0].value;
    }
  });
}
export const disabledCheckBox = ({event,idAttribute}) => {
  if (event.target.matches("#antecedentes_familiares"+idAttribute)) {
    const input = document.getElementById("antecedentes_familiares"+(idAttribute+1));
    if (event.target.checked) {
      input.removeAttribute("disabled","");
    }else{
      input.setAttribute("disabled","");
    }
  }
}

export const verfificationInputs = ({inputId,lengthLetter=null,type=null}) => {
  let response=false;
  const  input = document.getElementById(inputId);

  
  // input.addEventListener('change', function(event) {
  //   const  palabra = input.value;
  //   const  longitud = palabra.length;
    
  // });

  input.addEventListener('change', function(event) {
    let  palabra = input.value;
    const  longitud = palabra.length;
    const patronNombres = /^[a-zA-ZáéíóúÁÉÍÓÚ]+$/;
    const patronTexto = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/;
    const patronEmail = /^[a-zA-Z0-9@.-_]+$/;
    const textEmail = /^[@.]+$/;
    const patronPassword = /^[a-zA-Z0-9@.-_@#$%&*]+$/;
    const buttonSubmit = document.getElementById("btn_save");


    if(type=="password"){
      if(!patronPassword.test(palabra)) {
        createPopover({inputId:input.id,mensaje:"El campo tiene caracteres no Permitidos"});
        response=false
      }else if(longitud<8) {
        createPopover({inputId:input.id,mensaje:"La contraseña debe ser mayor a 8 caracteres"});
        response=false
      } else {
        response=true
      }
    }else if(type=="name"){
      if (!patronNombres.test(palabra)) {
        createPopover({inputId:input.id,mensaje:"El campo tiene caracteres no Permitidos"});
        response=false;
      }else if(longitud<3){
        console.log('El texto es muy pequeno');
        createPopover({inputId:input.id,mensaje:"El texto debe ser mayor o igual a 3 caracteres"});
        response=false;
      } else {
        response=true;
      }
    }else if(type=="text"){
      if (!patronTexto.test(palabra)) {
        createPopover({inputId:input.id,mensaje:"El campo tiene caracteres no Permitidos"});
        response=false;
      }else if(longitud<3){
        console.log('El texto es muy pequeno');
        createPopover({inputId:input.id,mensaje:"El texto debe ser mayor o igual a 3 caracteres"});
        response=false;
      } else {
        response=true;
      }
    }else if(type=="email"){
      if(!patronEmail.test(palabra)) {
        createPopover({inputId:input.id,mensaje:"El campo tiene caracteres no Permitidos"});
        response=false
      }else if(longitud<8) {
        createPopover({inputId:input.id,mensaje:"El correo debe ser mayor a 8 caracteres"});
        response=false;
      }else if(input.type=="email") {
        createPopover({inputId:input.id,mensaje:"El correo debe ser mayor a 8 caracteres"});
        response=false;
      }else if(!palabra.includes(".") && !palabra.includes("@")){
        response=false;
        createPopover({inputId:input.id,mensaje:"El correo no contiene el punto o  el @"});
      } else {
        response=true;
      }
    }else if(type=="cedula"){
      // const cedulaVer=isValidCI({ci:palabra});
      const cedulaVer=true;
      if(cedulaVer){
        response=true;
      }else{
        createPopover({inputId:input.id,mensaje:"Introduzca una cedula valida"});
        response=false
      }
    }else if(type=="phone"){
      if(longitud==lengthLetter&&palabra % 1 === 0){
        response=true;
      }else{
        createPopover({inputId:input.id,mensaje:"Introduzca un numero valido"});
        response=false
      }
    }else if(type=="date"){
      if(palabra!="Seleccione"){
        response=true;
      }else{
        response=false;
      }
     }else if(type=="select"){
      onChangeValueSelect({idElement:"rol", toCompare:"collapse_roles"});
      if(palabra!="Seleccione"){
        response=true;
      }else{
        response=false;
      }
    }


    if(response){
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }else{
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    if(longitud===0){
      input.classList.remove('is-invalid');
    }
    
  });
  
}

export const enableButtonVerification = ({idElement}) => {
  const buttonSubmit = document.getElementById(idElement);
  // Función para comprobar los elementos
  const comprobarElementos = () => {
    if(document.getElementById(idElement)){
      const dni=document.getElementById("dni").classList.contains("is-valid");
      const user_name=document.getElementById("user_name").classList.contains("is-valid");
      const password=document.getElementById("password").classList.contains("is-valid");
      const password_confirm=document.getElementById("password_confirm").classList.contains("is-valid");
      const first_name=document.getElementById("first_name").classList.contains("is-valid");
      const second_name=document.getElementById("second_name").classList.contains("is-valid");
      const first_lastname=document.getElementById("first_lastname").classList.contains("is-valid");
      const second_lastname=document.getElementById("second_lastname").classList.contains("is-valid");
      const birthDate=document.getElementById("birthDate").classList.contains("is-valid");
      const speciality=document.getElementById("speciality").classList.contains("is-valid");
      const email=document.getElementById("email").classList.contains("is-valid");
      const phone=document.getElementById("phone").classList.contains("is-valid");
      const sex=document.getElementById("sex").classList.contains("is-valid");
      const rol=document.getElementById("rol").classList.contains("is-valid");
      // Obtiene todos los elementos input y select dentro del contenedor
      if (dni && user_name && password && password_confirm && first_name && second_name && 
        first_lastname && second_lastname && birthDate && speciality && email && phone && sex && rol) {
        buttonSubmit.disabled=false;
      }else{
        buttonSubmit.disabled=true;
      }
    }
  }
  if(document.getElementById(idElement)){
    setInterval(comprobarElementos, 1000);
  }

  // Ejecuta la función cada segundo
}

export const setAtributeInputs = ({ idContainer, typeInput=null, clase=null }) => {
  const container = document.getElementById(idContainer);
  let inputs;
  if(typeInput==null){
    inputs = container.querySelectorAll(
      'input[type="text"],input[type="checkbox"],input[type="date"], select, textarea'
    );
  }else{
    inputs = container.querySelectorAll(typeInput)
  }

  inputs.forEach((input) => {

    if(input.classList.contains("is-invalid")){
      input.classList.replace("is-invalid","is-valid");
    }else{
      input.classList.add("is-valid");
    }
  });
}






