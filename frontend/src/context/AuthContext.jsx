import { createContext, useContext, useState, useEffect } from "react";
import {
  // getOneUser,
  loginRequest,
  getSessionRequest,
} from "../api/userRequest.js";
import { jwt } from "../api/axios";
import { Link } from 'react-router-dom';

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
  const [user, setUser] = useState({ roles: [] });

  const loadUserProfile = async () => {
    try {
      setIsLoading(false);
      setIsAuthenticated(true);
      const session = await getSessionRequest();
      // console.log(session.data)
      // const user = await getOneUser(session.data.userId);

      // const data = {
      //   ci: user.data.ci,
      //   firstLastName: user.data.firstLastName,
      //   firstName: user.data.firstName,
      //   photo: user.data.photo,
      //   roles: user.data.roles,
      //   secondLastName: user.data.secondLastName,
      //   secondName: user.data.secondName,
      //   userId: user.data.userId,
      //   username: user.data.username,
      //   loginRol: session.data.loginRol,
      // };

      if (session.data) {
        setUser(session.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signin = async (user) => {
    try {
      const response = await loginRequest(user);
      const { data } = response;
      
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        loadUserProfile();
      }else{
        setMessage(data.message)
        setStatus(data.status)
      // console.log(data.message)

      }
    } catch (error) {
      // console.log(error.response.data.mensaje);
      setErrors(error);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
