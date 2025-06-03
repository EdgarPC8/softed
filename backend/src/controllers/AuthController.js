// import { searchUser } from "../database/connection.js";
// import { sequelize } from "../database/connection.js";
import { Users } from "../models/Users.js";
import { Account } from "../models/Account.js";
import bycrypt from "bcrypt";
import { createAccessToken, createLicenseToken, getHeaderToken, verifyJWT } from "../libs/jwt.js";
// import jwt from "jsonwebtoken";
import { Roles } from "../models/Roles.js";
// import { UserRoles } from "../Models/UserRoles.js";
import { logger } from "../log/LogActivity.js";
import { License } from "../models/License.js";
import { calculateExpirationDate } from "../helpers/functions.js";


// Llamar a la función para agregar un usuario
// agregarUsuario("admin", "contraseña", 1);

export const login = async (req, res) => {

  const { username, password} = req.body;
  const system=req.headers['user-agent'];

  try {
    const account = await Account.findOne({
      where: { username },
      include: [
        {
          model: Roles,
          as: 'role',
        },
        {
          model: Users,
          as: 'user',
        },
      ],
    });
    

    if (!account) {
      return res.status(400).json({ message: "Datos incorrectos" });
    }

    const isCorrectPassword = await bycrypt.compare(password, account.password);

    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Datos incorrectos" });
    }


    const payload = {
      userId: account.userId,
      loginRol: account.role.name,
      rolId: account.role.id,
      accountId: account.id,
      // username: account.username,
      // photo: account.user.photo,
      // firstName:account.user.firstName,
      // secondName:account.user.secondName,
      // firstLastName:account.user.firstLastName,
      // secondLastName:account.user.secondLastName,
      // gender:account.user.gender,
      // birthday:account.user.birthday,
    };
    
    // //Crear token JWT
    const token = await createAccessToken({ payload });
    const user=account.user

    logger({
      httpMethod: req.method,
      endPoint: req.originalUrl,
      action: "Se a Logeado al Sistema",
      description: `EL ${account.role.name} ${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName} con CI: ${user.ci}`,
      system:system
    });



    res.json({ message: "User auth",token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
export const verifytoken = async (req, res) => {
  
  try {
    const token = getHeaderToken(req);

  if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = await verifyJWT(token);

    res.json(decoded);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export const renoveLicense = async (req, res) => {
  const {name} = req.body;
  const now = new Date();
  try {
    const lic= await License.findOne({
      where: {...name,valide:1}
    });

    if(!lic)return res.status(401).json({ message: "Clave incorrecta para Licencia" });

    const dateExpiration = calculateExpirationDate(now, lic.time);


  const payload={
    time:lic.time,
    dateCreation:lic.dateCreation,
    codex:lic.name,
  }
  const token = await createLicenseToken({payload})
     await License.update({valide:0,token:token,dateUse:now,dateExpiration:dateExpiration},
      {
        where: {
          valide: 1,id:lic.id
        },
      }
    );

    const newTokenKey= await License.findOne({
      attributes:["token",'dateCreation',"name","time","dateExpiration"],
      where: {id:lic.id}
    });
    res.json({ message: "Clave correcta para Licencia",data:newTokenKey });
  } catch (error) {
    return res.status(401).json({ message: "License Caducada" });
  }
};
export const getLicenses = async (req, res) => {
  try {
    const data = await License.findAll();

    // console.log("Consulta completada:", users);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor." });
  }
  };
  export const addLicense = async (req, res) => {
    try {
    
      const {time,valorTime,name}= req.body;
  
      const newData = await License.create({
        time:`${valorTime}${time}`,
        name:name
      });
      res.json({ message: `agregado con éxito`,data:newData});
  
    } catch (error) {
      // manejo de errores si ocurre algún problema durante la creación del usuario
      console.error("error al crear el rol:", error);
    }
  };

  export const getOneLicense = async (req, res) => {
    const { id } = req.params;
    try {
      const data = await License.findOne({
        where: { id:id },
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
 
  export const deleteLicense= async (req, res) => {
    try {
      const removingLicense= await License.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json({ message: "Licencia eleminada con éxito" });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  export const updateLicense = async (req, res) => {
    const data=req.body;
    try {
      const lic = await License.findOne({
        where: { id: req.params.id },
      });
      if(lic.valide==0)return res.status(401).json({ message: "Ya no se puede Editar" });

      const userUpdate = await License.update(data,
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.json({ message: "Licencia editada con éxito" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  

// export { login, verifytoken };
