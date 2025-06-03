import { createContext, useContext, useState, useEffect } from "react";
import {
  getOneUserRequest,
  loginRequest,
  getSessionRequest,
} from "../api/userRequest.js";

import { jwt, pathPhotos } from "../api/axios";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack"; // Importa useSnackbar
import { getAccount } from "../api/accountRequest.js";


const AuthContext = createContext();

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const loadUserProfile = async () => {
    try {
      setIsLoading(false);
      setIsAuthenticated(true);
      const session = await getSessionRequest();
      // console.log(session.data)
      const {data} = await getAccount(session.data.userId,session.data.rolId);

      const userData = {
        ci: data.user.ci,
        firstName: data.user.firstName,
        secondName: data.user.secondName,
        firstLastName: data.user.firstLastName,
        secondLastName: data.user.secondLastName,
        birthday:data.user.birthday,
        username: data.username,
        accountId: data.id,
        userId: session.data.userId,
        rolId: session.data.rolId,
        loginRol: session.data.loginRol,
      };
      // console.log(userData)

      if (session.data) {
        setUser(userData);
        setProfileImageUser(`${pathPhotos}${data.user.photo}`)
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
        description: "Alguna descripcion", // Descripción usando el mensaje de éxito por defecto
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
  
    // Configurar el timeout para mostrar el snackbar solo si la promesa tarda más de 1 segundo
    snackbarTimeout = setTimeout(() => {
      loadingSnackbar = enqueueSnackbar("Esperando...", {
        variant: 'info',
        persist: true, // El snackbar se queda hasta que se cierre manualmente
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    }, 1000); // Mostrar el snackbar si tarda más de 1 segundo
  
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
      // Cancelar el temporizador si ocurre un error antes de los 1000ms
      clearTimeout(snackbarTimeout);
  
      // Si ya se mostró el snackbar de "Esperando...", lo cerramos
      if (loadingSnackbar) {
        closeSnackbar(loadingSnackbar);
      }
  
      // Inicializar con los valores por defecto para errores
      let errorAttributes = {
        title: "Error", // Título por defecto para errores
        description: errorMessage || error.message, // Descripción del error
        variant: 'error', // Tipo de toast para error
        autoHideDuration: 3000 // Duración por defecto para errores
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
  
  
  
  
  
  

  const signin = async (user) => {

    try {
      const response = await loginRequest(user);
      const { data } = response;
      // console.log(data)

      if (data.token) {
        window.localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        loadUserProfile();
        return;
      }
      setErrors({ message: data.message, status: data.status });
    } catch (error) {
      setIsAuthenticated(false);
      setIsLoading(true);
      setErrors(error.response.data.message);
    }
  };

  const logout = async () => {
    window.localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.reload();
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
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export { useAuth, AuthProvider };

