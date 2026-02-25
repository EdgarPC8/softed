import { createContext, useContext, useState, useEffect } from "react";
import {
  getOneUserRequest,
  loginRequest,
  getSessionRequest,
} from "../api/userRequest.js";
import axios, { jwt, pathImg } from "../api/axios.js";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getAccount } from "../api/accountRequest.js";
import { changeRole as changeRoleRequest } from "../api/authRequest.js";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

const AuthContext = createContext();

/** Orígenes permitidos para postMessage (SSO desde PHP/GAISTMS). Solo se acepta de estos orígenes. */
const ALLOWED_POST_MESSAGE_ORIGINS = [
  "https://gaistms.marianosamaniego.edu.ec",
  "http://gaistms.marianosamaniego.edu.ec",
  "https://aplicaciones.marianosamaniego.edu.ec",
  "http://aplicaciones.marianosamaniego.edu.ec",
  "http://localhost",
  "http://127.0.0.1",
];
const POST_MESSAGE_TYPE_TOKEN = "ALUMNI_TOKEN";
const POST_MESSAGE_TYPE_SSO = "ALUMNI_SSO";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};

const AuthProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(true);
  const [status, setStatus] = useState(true);
  const [profileImageUser, setProfileImageUser] = useState(null); // Nuevo estado para la imagen de perfil

  const [user, setUser] = useState([]);
  const [isSsoRegistering, setIsSsoRegistering] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const loadUserProfile = async () => {
    try {
      setIsLoading(false);
      setIsAuthenticated(true);
      const session = await getSessionRequest();
      // console.log(session.data)
      const {data} = await getAccount(session.data.accountId,session.data.rolId);

      const userData = {
        ci: data.user.ci,
        firstName: data.user.firstName,
        secondName: data.user.secondName,
        firstLastName: data.user.firstLastName,
        secondLastName: data.user.secondLastName,
        birthday: data.user.birthday,
        gender: data.user.gender,
        username: data.username,
        accountId: data.id,
        userId: session.data.userId,
        rolId: session.data.rolId,
        loginRol: session.data.loginRol,
        roles: data.roles || [], 
      };
      // console.log(userData)

      if (session.data) {
        setUser(userData);
        setProfileImageUser(`${pathImg}${data.user.photo}`)
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const toast = async ({
    promise, 
    successMessage = "Operación exitosa", // Mensaje por defecto de éxito
    errorMessage = "Ocurrió un error", // Mensaje por defecto de error
    onSuccess = null, // Función opcional para ejecutar en caso de éxito
    onError = null, // Función opcional para ejecutar en caso de error
    info=null

  }) => {
    if(info){
      let infoAttributes = {
        title: "Informacion", // Título por defecto
        description: "Alguna Descripcion", // Descripción usando el mensaje de éxito por defecto
        variant: 'warning', // Tipo de toast
        autoHideDuration: 3000 // Duración por defecto
      };
      enqueueSnackbar(info.description?info.description:infoAttributes.description, { 
        variant: infoAttributes.variant, 
        autoHideDuration: infoAttributes.autoHideDuration 
      });
      return;
    }



    let loadingSnackbar = null;
    let snackbarTimeout = null;
  
    // Mostrar "Esperando..." solo si la promesa tarda más de 3 segundos (evita flashes innecesarios)
    snackbarTimeout = setTimeout(() => {
      loadingSnackbar = enqueueSnackbar("Esperando...", {
        variant: 'info',
        persist: true,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    }, 3000);
  
    try {
      const response = await promise; // Esperar la promesa
  
      // Si la promesa se resuelve antes del timeout, cancelamos el snackbar
      clearTimeout(snackbarTimeout);
  
      // Si ya se mostró el snackbar de "Esperando...", lo cerramos
      if (loadingSnackbar) {
        closeSnackbar(loadingSnackbar);
      }
  
      // Inicializar con los valores por defecto
      let successAttributes = {
        title: "Operación exitosa", // Título por defecto
        description: successMessage, // Descripción usando el mensaje de éxito por defecto
        variant: 'success', // Tipo de toast
        autoHideDuration: 3000 // Duración por defecto
      };
  
      // Ejecutar la función de éxito si fue proporcionada y sobrescribir los atributos del toast
      if (onSuccess) {
        const customAttributes = onSuccess(response); // Ejecución de onSuccess y retorno de atributos personalizados
        successAttributes = {
          ...successAttributes, // Mantener los valores por defecto
          ...customAttributes // Sobrescribir con los atributos personalizados (title, description)
        };
      }
  
      // Mostrar el toast con los atributos finales (ya sea personalizados o por defecto)
      enqueueSnackbar(successAttributes.description, { 
        variant: successAttributes.variant, 
        autoHideDuration: successAttributes.autoHideDuration 
      });
  
      return response; // Retornar la respuesta del backend
    } catch (error) {
      // Cancelar el temporizador si ocurre un error antes de mostrar "Esperando..."
      clearTimeout(snackbarTimeout);
  
      // Si ya se mostró el snackbar de "Esperando...", lo cerramos
      if (loadingSnackbar) {
        closeSnackbar(loadingSnackbar);
      }
  
      // Mensaje: priorizar respuesta del backend (error.response.data.message), luego el errorMessage pasado, luego error.message
      const apiMessage = error?.response?.data?.message;
      const descError = apiMessage || errorMessage || error?.message;

      // Inicializar con los valores por defecto para errores
      let errorAttributes = {
        title: "Error", // Título por defecto para errores
        description: descError, // Descripción del error (incluye mensajes del backend)
        variant: 'error', // Tipo de toast para error
        autoHideDuration: 4000 // Un poco más para leer mensajes largos
      };
  
      // Ejecutar la función de error si fue proporcionada y sobrescribir los atributos del toast
      if (onError) {
        const customErrorAttributes = onError(error); // Ejecución de onError y retorno de atributos personalizados
        errorAttributes = {
          ...errorAttributes, // Mantener los valores por defecto
          ...customErrorAttributes // Sobrescribir con los atributos personalizados (title, description)
        };
      }
  
      // Mostrar el mensaje de error
      enqueueSnackbar(errorAttributes.description, { 
        variant: errorAttributes.variant, 
        autoHideDuration: errorAttributes.autoHideDuration 
      });
  
      throw error; // Lanzar el error para manejarlo en la llamada original
    }
  };
  
  
  const changeRole = async (newRoleId) => {
    try {
      const { data } = await changeRoleRequest({
        accountId: user.accountId,
        rolId: newRoleId,
      });
  
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        loadUserProfile(); // para actualizar datos del nuevo rol
      }
    } catch (error) {
      console.error("Error al cambiar de rol:", error);
    }
  };
  
  

  const signin = async (user) => {
    try {
      const response = await loginRequest(user);
      const { data } = response;
  
      // Si se requiere seleccionar un rol
      if (data.selectRole) {
        return { selectRole: true, roles: data.roles, accountId: data.accountId };
      }
  
      // Si se devuelve directamente el token
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        loadUserProfile();
        return { success: true };
      }
  
      setErrors({ message: data.message, status: data.status });
      return { error: true };
    }catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false); // ✅ correcto: ya no está cargando
        setErrors({
          message: error.response?.data?.message || "Error de conexión",
          status: "error",
        });
        return { error: true };
      }
      
  };
  
  const logout = async () => {
    window.localStorage.removeItem("token");
    setIsAuthenticated(false);
    // window.location.reload();
    // <Link to="/">Ir al inicio</Link>
  };

  const checkLogin = async () => {
    if (!jwt()) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const session = await getSessionRequest();

      // console.log(session)
      if (session.status) {
        setIsLoading(false);
        setIsAuthenticated(true);
        loadUserProfile();
      }

      // console.log(res);
    } catch (error) {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  // Listener para postMessage (SSO desde PHP/GAISTMS). Acepta token directo o datos para registrar/login.
  useEffect(() => {
    const handleMessage = async (event) => {
      if (!ALLOWED_POST_MESSAGE_ORIGINS.includes(event.origin)) return;

      const { type, token, ci, firstName, secondName, firstLastName, secondLastName, id_estudiante, urlWeb } = event.data || {};

      // Token directo: guardar y loguear
      if (type === POST_MESSAGE_TYPE_TOKEN && typeof token === "string" && token.trim()) {
        setIsSsoRegistering(true);
        try {
          window.localStorage.setItem("token", token.trim());
          setIsAuthenticated(true);
          await loadUserProfile();
        } finally {
          setIsSsoRegistering(false);
        }
        return;
      }

      // Datos de usuario: mostrar cuadro "Se está registrando...", llamar API smistms/login, loguear
      if (type === POST_MESSAGE_TYPE_SSO && ci && firstName && firstLastName) {
        setIsSsoRegistering(true);
        try {
          const res = await axios.post("/smistms/login", {
            ci: String(ci).trim(),
            firstName: String(firstName).trim(),
            secondName: secondName ? String(secondName).trim() : "",
            firstLastName: String(firstLastName).trim(),
            secondLastName: secondLastName ? String(secondLastName).trim() : "",
            id_estudiante: id_estudiante ?? null,
            urlWeb: urlWeb ?? null,
          });
          const data = res.data;
          if (data?.token) {
            window.localStorage.setItem("token", data.token);
            setIsAuthenticated(true);
            await loadUserProfile();
          } else {
            enqueueSnackbar(data?.message || "No se recibió token", { variant: "error" });
          }
        } catch (err) {
          const msg = err?.response?.data?.message || err?.message || "Error al registrarse";
          enqueueSnackbar(msg, { variant: "error" });
        } finally {
          setIsSsoRegistering(false);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (errors.message) {
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }
  }, [errors]);

  // Verifica si tiene token el usuario

  return (
    <AuthContext.Provider
      value={{
        signin,
        errors,
        logout,
        isAuthenticated,
        loadUserProfile,
        isLoading,
        user,
        message,
        status,
        toast,
        setProfileImageUser,
        profileImageUser,
        setUser,
        changeRole
      }}
    >
      {children}
      <Backdrop
        open={isSsoRegistering}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" size={48} />
        <Typography variant="h6" color="inherit">
          Se está registrando desde otra página...
        </Typography>
      </Backdrop>
    </AuthContext.Provider>
  );
};


export { useAuth, AuthProvider };

