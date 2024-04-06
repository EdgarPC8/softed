// // import { header } from "../view/header.html";
// // import header from "../view/header.html";
// import { rules } from "../rules/rules.js";

// export default async () => {
  
//   const headerRoot = document.querySelector("#header");
//   const headerContainer = document.createElement("div");
//   headerRoot.innerHTML = "";

//   const response = await fetch("./view/header.html");
//   const header = await response.text();

//   headerContainer.innerHTML = header;
//   headerRoot.appendChild(headerContainer);
 

//   // const btnLogout = document.querySelector("#btn_logout");
 
//   // notify(dni, rolId);

//   // btnLogout.addEventListener("click", async () => {
//   //   await fetch(`${rules.ip}/system_clinic/src/api/auth/logout`);

//   //   location.reload();
//   // });

//   return;
// };
// import { header } from "../view/header.html";
import header from "../view/header.html?raw";

export default async (authorizedUserData) => {
  const headerRoot = document.querySelector("#header");
  const mainContainer = document.querySelector("#root");

  headerRoot.innerHTML = header;


  const navItemUsers = document.getElementById("itemNav_users");
  const navItemInstitution = document.getElementById("itemNav_institution");
  const navItemLogs = document.getElementById("itemNav_logs");
  const containerDropdown = document.querySelector("#dropdown_container");



  return;
};

