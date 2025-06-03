import { Account } from "../models/Account.js";
import { Roles } from "../models/Roles.js";
import { Users } from "../models/Users.js";
import bycrypt from "bcrypt";



export const getAccounts = async (req, res) => {
  try {
  
    const data = await Account.findAll({
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
    res.json(data);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
  };
  
  export const getOneAccount= async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Account.findOne({
        attributes: ['username','rolId','userId'],
        where: { id:id },
      });
  
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const getAccount= async (req, res) => {
    const { userId,rolId } = req.params;
    try {
      const data = await Account.findOne({
        where: { userId:userId,rolId:rolId },
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
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const addAccount = async (req, res) => {
    try {
      const {
        username,
        password,
        rolId,
        userId,
      } = req.body;

      const passgenerate = await bycrypt.hash(password, 10);

      const newData = await Account.create({
        username:username,
        password:passgenerate,
        rolId:rolId,
        userId:userId,

      });
    res.json({ message: `agregado con éxito`,data:newData});
    } catch (error) {
      // manejo de errores si ocurre algún problema durante la creación del usuario
      console.error("error al crear la cuenta:", error);
    }
  };
  export const deleteAccount = async (req, res) => {
    try {
      await Account.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      res.json({ message: "Cuenta eleminado con éxito" });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  export const updateAccount = async (req, res) => {
    const data=req.body;
    const idAccount=req.params.id;
    const cuenta={
      username:data.username,
      rolId:data.rolId,
    }

    try {

      if(data.password){

        const passAcc = await Account.findOne({
          attributes: ['password'],
          where: { id:idAccount },
        });
  
        const isCorrectPassword = await bycrypt.compare(data.password, passAcc.password);
  
    
        if(!isCorrectPassword){
          res.status(500).json({
            message: "La contraseña no coincide con la Anterior",
          });
        }
      const passgenerate = await bycrypt.hash(data.password, 10);
      cuenta.password=passgenerate;
      }

     await Account.update(cuenta,
        {
          where: {
            id: idAccount
          },
        }
      );
      res.json({ message: "cuenta editado con éxito" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const updateAccountUser = async (req, res) => {
    const data=req.body;
    const idAccount=req.params.id;
    const userId=req.params.userId;
    try {

      if(data.password&&data.confirmPassword){
        
        const passAcc = await Account.findOne({
          attributes: ['password'],
          where: { id:idAccount },
        });
  
        const isCorrectPassword = await bycrypt.compare(data.password, passAcc.password);
  
    
        if(!isCorrectPassword){
          res.status(500).json({
            message: "La contraseña no coincide con la Anterior",
          });
        }
      const passgenerate = await bycrypt.hash(data.confirmPassword, 10);
      await Account.update({password:passgenerate},
        {
          where: {
            id: idAccount,
          },
        }
      );
      }
    //  if( data.password)delete data.password
    //  if( data.confirmPassword)delete data.confirmPassword

      await Users.update(data,
        {
          where: {
            id: userId
          },
        }
      );

      const newAccount = await Account.findOne({
        where: { id:idAccount},
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
      const userData = {
        ci: newAccount.user.ci,
        firstName: newAccount.user.firstName,
        secondName: newAccount.user.secondName,
        firstLastName: newAccount.user.firstLastName,
        secondLastName: newAccount.user.secondLastName,
        username: newAccount.username,
        accountId: newAccount.id,
        userId: newAccount.userId,
        rolId: newAccount.rolId,
        loginRol: newAccount.role.name,
      };
    
      res.json({ message: "cuenta editado con éxito",data:userData});
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const resetPassword = async (req, res) => {
    // const data=req.body;
    const idAccount=req.params.id;

  
    try {

      const passgenerate = await bycrypt.hash("12345678", 10);

     await Account.update({
      password:passgenerate,
     },
        {
          where: {
            id: idAccount
          },
        }
      );
      res.json({ message: "Password Reseteda a 12345678 con éxito" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


export const getRoles = async (req, res) => {
  try {
    const data = await Roles.findAll();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
  };
  export const getOneRol= async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Roles.findOne({
        where: { id:id },
      });
  
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const addRol = async (req, res) => {
    try {
      const data= req.body;
    const newData = await Roles.create(data);
    res.json({ message: `agregado con éxito`,data:newData});
    } catch (error) {
      // manejo de errores si ocurre algún problema durante la creación del usuario
      console.error("error al crear el rol:", error);
    }
  };
  export const deleteRol = async (req, res) => {
    try {
      await Roles.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      res.json({ message: "Rol eleminado con éxito" });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  export const updateRol = async (req, res) => {
    const data=req.body;
  
    try {
     await Roles.update(data,
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.json({ message: "Rol editado con éxito" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

