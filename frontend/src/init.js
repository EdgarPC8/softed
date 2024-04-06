import { router } from "./router/router.js";

export const init = () => {
  router(location.hash)

  window.addEventListener("hashchange", () => {

    router(location.hash);
  });
};

