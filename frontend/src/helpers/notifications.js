export const sendNotify = ({ title, msg }) => {
  const notify = document.querySelector("#notify");
  const toastHeader = document.querySelector(".toast-header");
  
  notify.querySelector(".title_notify").innerText = title;
  notify.querySelector(".toast-body").innerText = msg;
  const toast = new bootstrap.Toast(notify);
  toast.show();
  
};

export const badgeNotify = ({ message, type, version }) => {
  let badge = "";

  if (version == 1) {
    badge = `
      <span class="badge w-100 bg-${type} p-2 bg-opacity-25 text-dark border border-${type} ">
        ${message}
      </span>
    `;
  }
  if (version === 2) {
    badge = `
      <span class="badge rounded-pill bg-${type} position-absolute top-0 start-100 translate-middle">
        ${message}
      </span>
  

      `;
    }
    return badge;
};

export const alertShow = ({ message, type }) => {
  const alert = document.querySelector("#liveAlertPlaceholder");
  alert.innerHTML = `
      <div class="alert alert-${type} alert-dismissible" role="alert">
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
  `;

  // if (dataPatient !== "empty") {
  //   // alert.classList.remove("alert", "alert-warning");
  //   alert.classList.add("alert", `alert-${type}`, "alert-dismissible");
  //   alert.innerHTML = `
  //       <div>${message}</div>
  //       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  //   `;
  //   // alert.innerText = `Existe el paciente ${dataPatient.nombres} ${dataPatient.apellido_paterno} Datos completados automáticamente`;
  // }
  // if (dataPatient.patient === "not found") {
  //   alert.classList.remove("alert", "alert-primary");
  //   alert.classList.add("alert", "alert-warning", "alert-dismissible");
  //   alert.innerText =
  //     "No existe paciente en la base de datos por favor complete los campos correctamente";

  //   }
  // clearInputs({ idAttribute: "firstAdmission" });
};
