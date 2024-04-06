export const permisosTecladoLetras= (event) => {
    //Esta funcion permite Mayusculas y minusculas y vocales con tildes
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚ]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        event.preventDefault();
    }
};
export const permisosTecladoLetrasEspacio= (event) => {
  //Esta funcion permite Mayusculas y minusculas y vocales con tildes
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]$/.test(event.key)&& event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
  }
};
// Solo se permiten números
export const permisosTecladoNumeros= (event) => {
    if (!/^[0-9]$/.test(event.key) && event.keyCode !== 8) {
        event.preventDefault();
    }
};
  
  export const setOnKeyDown= () => {
    
    const fatherLastname = document.querySelector("#father_lastname");
    const motherLastname = document.querySelector("#mother_lastname");
    const firstName = document.querySelector("#first_name");
    const secondName = document.querySelector("#second_name");
    const placeBirth = document.querySelector("#place_birth");
    const nationality = document.querySelector("#nationality");
    const culturalGroup = document.querySelector("#cultural_group");
    const age = document.querySelector("#age");
    const civilStatus = document.querySelector("#civil_status");
    const sex = document.querySelector("#options_sex");

    const habitualResidence = document.querySelector("#habitual_residence");
    const neighborhood = document.querySelector("#neighborhood");
    const parish = document.querySelector("#parish");
    const canton = document.querySelector("#canton");
    const province = document.querySelector("#province");
    const zone = document.querySelector("#zone");
    const phone = document.querySelector("#phone");

    const instruction = document.querySelector("#instruction");
    const ocupation = document.querySelector("#ocupation");
    const workCompany = document.querySelector("#work_company");
    const typeHealthInsurance = document.querySelector("#type_health_insurance");
    const referred = document.querySelector("#referred");
    const emergencyPerson1 = document.querySelector("#emergency_person1");
    const emergencyPerson2 = document.querySelector("#emergency_person2");
    const emergencyPerson3 = document.querySelector("#emergency_person3");
    const emergencyPerson4 = document.querySelector("#emergency_person4");
    const admissionDate = document.querySelector("#admission_date");
    const medicalRedordFooterDate = document.querySelector("#fecha_pie_ficha");
    const medicalRecordFooterHour = document.querySelector("#hora_pie_ficha");
    const professionalName = document.querySelector("#professional_name");
    const professionalCode = document.querySelector("#professional_code");
    const sheetNumber = document.querySelector("#sheet_number");
  
    fatherLastname.addEventListener("keydown", permisosTecladoLetras);
    motherLastname.addEventListener("keydown", permisosTecladoLetras);
    firstName.addEventListener("keydown", permisosTecladoLetras);
    secondName.addEventListener("keydown", permisosTecladoLetras);
    habitualResidence.addEventListener("keydown", permisosTecladoLetras);
    neighborhood.addEventListener("keydown", permisosTecladoLetras);
    parish.addEventListener("keydown", permisosTecladoLetras);
    canton.addEventListener("keydown", permisosTecladoLetras);
    province.addEventListener("keydown", permisosTecladoLetras);
    zone.addEventListener("keydown", permisosTecladoLetras);
    placeBirth.addEventListener("keydown", permisosTecladoLetras);
    nationality.addEventListener("keydown", permisosTecladoLetras);
    culturalGroup.addEventListener("keydown", permisosTecladoLetras);
    instruction.addEventListener("keydown", permisosTecladoLetras);
    ocupation.addEventListener("keydown", permisosTecladoLetras);
    instruction.addEventListener("keydown", permisosTecladoLetras);
    workCompany.addEventListener("keydown", permisosTecladoLetras);
    typeHealthInsurance.addEventListener("keydown", permisosTecladoLetras);
    referred.addEventListener("keydown", permisosTecladoLetras);
    emergencyPerson1.addEventListener("keydown", permisosTecladoLetras);
    emergencyPerson2.addEventListener("keydown", permisosTecladoLetras);
    emergencyPerson3.addEventListener("keydown", permisosTecladoLetras);
    emergencyPerson4.addEventListener("keydown", permisosTecladoNumeros);


    phone.addEventListener("keydown", permisosTecladoNumeros);
    age.addEventListener("keydown", permisosTecladoNumeros);

    

    
  };
  export const setOnKeyDownFormUser= () => {
    const ci = document.querySelector("#dni");
    const userName = document.querySelector("#user_name");
    const phone = document.querySelector("#phone");
    const firstName = document.querySelector("#first_name");
    const secondName = document.querySelector("#second_name");
    const firstLastName = document.querySelector("#first_lastname");
    const secongLastName = document.querySelector("#second_lastname");
    const speciality = document.querySelector("#speciality");
    
    ci.addEventListener("keydown", permisosTecladoNumeros);
    userName.addEventListener("keydown", permisosTecladoLetras);
    phone.addEventListener("keydown", permisosTecladoNumeros),
    firstLastName.addEventListener("keydown", permisosTecladoLetras);
    secongLastName.addEventListener("keydown", permisosTecladoLetras);
    firstName.addEventListener("keydown", permisosTecladoLetras);
    secondName.addEventListener("keydown", permisosTecladoLetras);
    speciality.addEventListener("keydown", permisosTecladoLetrasEspacio);
  };
  

 
  