import home from "../view/home.html?raw";
import { rules } from "../rules/rules.js";
import DataTable from "datatables.net-bs5";
import Swal from "sweetalert2";
import {createModal,login} from "../helpers/functions.js";



export default async () => {
  const mainContainer = document.querySelector("#root");
  mainContainer.innerHTML = home;


  createModal({
    IdContainer:`containerIngresar`,
    TittleModal:`Ingresar`,
    IdModal:`ingresar`,
    ArrayInputs:{
      password:{
        Text:`Contraseña`,
        Type:`text`,
      },
    },
  });

  login({
    Url:`${rules.ip}/login`,
    IdForm:`form_ingresar`,
});
  



  return;
};