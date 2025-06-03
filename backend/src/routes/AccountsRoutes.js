import { Router } from "express";
import {
    updateAccountUser,
    resetPassword,
    getAccounts,
    getOneAccount,
    addAccount,
    deleteAccount,
    updateAccount,
    getAccount,
    getRoles,
    getOneRol,
    addRol,
    deleteRol,
    updateRol,
} from "../controllers/AccountController.js";

const router = new Router();
router.get("/account", getAccounts);
router.get("/account/:id", getOneAccount);
router.get("/account/:userId/:rolId", getAccount);
router.post("/account", addAccount);
router.delete("/account/:id", deleteAccount);
router.put("/account/:id",updateAccount);
router.put("/account/resetPassword/:id",resetPassword);
router.put("/account/updateAccountUser/:id/:userId/:rolId",updateAccountUser);


router.get("/rol", getRoles);
router.get("/rol/:id", getOneRol);
router.post("/rol", addRol);
router.delete("/rol/:id", deleteRol);
router.put("/rol/:id",updateRol);


export default router;
