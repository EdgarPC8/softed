import { rules } from "../rules/rules.js";
import { inputsNumberToTime,inputsTimeToNumber, inputsSoloNumeros, getDateNow ,inputsDisabled, inputsAddTimes,inputsClear} from "../helpers/functions.js";


export default async () => {
    const mainContainer = document.querySelector("#root");
    const usersContainer = document.createElement("div");
    const response = await fetch("./view/info.html");
    const users = await response.text();

    usersContainer.innerHTML = users;
    mainContainer.appendChild(usersContainer);

    const info = document.querySelector("#container_info");
    const responseRoles = await fetch(`${rules.ip}/api/getInfo`);
    const information = await responseRoles.json();
    info.innerHTML=information;
    console.log(information)
    


    
    
    return;
}
