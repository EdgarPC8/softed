// src/api/FilesRequests.js
import axios, { jwt } from "./axios.js";

/**
 * RUTAS BACKEND (según tu FilesRoutes.js)
 *  POST   /files/upload        (auth) multipart/form-data: file + folder + name? + replace?
 *  DELETE /files/delete        (auth) query/body: relPath
 *  GET    /files/scan          (auth) query: folder? maxDepth? includeAll?
 *  DELETE /files/folder        (auth) query: folder + force?
 *  GET    /files/download      (auth) query: folder   => ZIP
 *  GET    /files/file/download (auth) query: relPath  => descarga 1 archivo (blob)
 *  GET    /files/file/view     (auth) query: relPath  => inline (normalmente pdf)
 */

// =========================
// SCAN (LISTAR / RECORRER)
// =========================
export const scanFilesRequest = async ({
  folder = "",
  maxDepth = 10,
  includeAll = true,
} = {}) =>
  await axios.get(
    `/files/scan?folder=${encodeURIComponent(folder)}&maxDepth=${encodeURIComponent(
      maxDepth
    )}&includeAll=${encodeURIComponent(includeAll)}`,
    {
      headers: { Authorization: jwt() },
    }
  );

// =========================
// UPLOAD / REPLACE
// =========================
// params:
// - file: File (obligatorio)
// - folder: string (ej: "Orders/123")       (opcional, pero recomendado)
// - name: string (ej: "factura.pdf")        (opcional)
// - replace: boolean                        (opcional)
export const uploadFileRequest = async ({
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

  return await axios.post("/files/upload", formData, {
    headers: {
      Authorization: jwt(),
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================
// DELETE FILE
// =========================
// relPath: "Orders/123/factura.pdf"
export const deleteFileRequest = async (relPath) =>
  await axios.delete(`/files/delete?relPath=${encodeURIComponent(relPath)}`, {
    headers: { Authorization: jwt() },
  });

// =========================
// DELETE FOLDER
// =========================
// folder: "Orders/123"
export const deleteFilesFolderRequest = (folder, { force = false } = {}) =>
  axios.delete(
    `/files/folder?folder=${encodeURIComponent(folder)}&force=${encodeURIComponent(force)}`,
    { headers: { Authorization: jwt() } }
  );

// =========================
// DOWNLOAD FOLDER ZIP
// =========================
export const downloadFilesFolderZipRequest = async (folder = "") =>
  await axios.get(`/files/download?folder=${encodeURIComponent(folder)}`, {
    headers: { Authorization: jwt() },
    responseType: "blob",
  });

// =========================
// DOWNLOAD 1 FILE (blob)
// =========================
export const downloadOneFileRequest = async (relPath = "") =>
  await axios.get(`/files/file/download?relPath=${encodeURIComponent(relPath)}`, {
    headers: { Authorization: jwt() },
    responseType: "blob",
  });

// =========================
// VIEW INLINE (url)
// =========================
// Esto NO hace request, solo construye la URL para abrir en <iframe> o window.open
export const buildFileUrl = (relPath = "") =>
  `/files/${String(relPath).replace(/^\/+/, "")}`;

// Si guardas rutas relativas en BD:
export const toFileUrlFromDbPath = (dbPath = "") => buildFileUrl(dbPath);

// (Opcional) si quieres URL directa al endpoint inline con auth,
// mejor lo abres con downloadOneFileRequest y creas un blob URL en frontend.
// Este helper solo arma el endpoint:
export const buildFileInlineEndpoint = (relPath = "") =>
  `/files/file/view?relPath=${encodeURIComponent(relPath)}`;

// =========================
// Helper: abrir blob como descarga
// =========================
export const saveBlobAsFile = (blob, filename = "archivo") => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
