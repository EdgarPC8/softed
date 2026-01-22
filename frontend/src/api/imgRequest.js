// src/api/ImgRequests.js
import axios, { jwt } from "./axios.js";

/**
 * RUTAS BACKEND (según tu ImgRoutes.js)
 *  POST   /img/upload   (auth)  multipart/form-data: file + folder + name? + replace?
 *  DELETE /img/delete   (auth)  query/body: relPath
 *  GET    /img/scan            query: folder? maxDepth? includeNonImages?
 *
 * Nota: En tu router /scan NO tiene isAuthenticated (por ahora).
 * Si luego lo proteges, solo añade headers en ese request también.
 */

// =========================
// SCAN (LISTAR / RECORRER)
// =========================
export const scanImagesRequest = async ({
  folder = "",
  maxDepth = 10,
  includeNonImages = false,
} = {}) =>
  await axios.get(
    `/img/scan?folder=${encodeURIComponent(folder)}&maxDepth=${encodeURIComponent(
      maxDepth
    )}&includeNonImages=${encodeURIComponent(includeNonImages)}`,
    {
      // Si luego proteges /scan, descomenta:
      headers: { Authorization: jwt() },
    }
  );

// =========================
// UPLOAD / REPLACE
// =========================
// params:
// - file: File (obligatorio)
// - folder: string (ej: "EdDeli/products")  (opcional, pero recomendado)
// - name: string (ej: "producto.png")       (opcional)
// - replace: boolean                        (opcional)
export const uploadImageRequest = async ({
  file,
  folder = "",
  name = "",
  replace = false,
} = {}) => {
  const formData = new FormData();

  // ✅ 1) primero los campos (texto)
  if (folder) formData.append("folder", folder);
  if (name) formData.append("name", name);
  formData.append("replace", String(!!replace));

  // ✅ 2) al final el archivo
  formData.append("file", file);

  return await axios.post("/img/upload", formData, {
    headers: {
      Authorization: jwt(),
      "Content-Type": "multipart/form-data",
    },
  });
};


// =========================
// DELETE
// =========================
// relPath: "EdDeli/products/a.png"
export const deleteImageRequest = async (relPath) =>
  await axios.delete(`/img/delete?relPath=${encodeURIComponent(relPath)}`, {
    headers: { Authorization: jwt() },
  });

/**
 * Helpers opcionales (por comodidad)
 */

// Arma la URL pública de una imagen estática servida por express.static
// OJO: esto depende de cómo tengas configurado axios.baseURL.
// Si baseURL ya incluye /eddeliapi, esto te sirve directo.
export const buildImgUrl = (relPath = "") => `/img/${String(relPath).replace(/^\/+/, "")}`;

// Si tú guardas rutas relativas en BD, te da la url rápida:
export const toImgUrlFromDbPath = (dbPath = "") => buildImgUrl(dbPath);

export const downloadFolderZipRequest = async (folder = "") =>
  await axios.get(`/img/download?folder=${encodeURIComponent(folder)}`, {
    headers: { Authorization: jwt() },
    responseType: "blob",
  });
  export const deleteFolderRequest = (folder, { force = false } = {}) =>
  axios.delete(
    `/img/folder?folder=${encodeURIComponent(folder)}&force=${encodeURIComponent(force)}`,
    { headers: { Authorization: jwt() } }
  );
