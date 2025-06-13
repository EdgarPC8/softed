import { Router } from "express";
import {
    getUsers,
    getOneUser,
    addUser,
    deleteUser,
    updateUserData,
    addUsersBulk
} from "../controllers/UserController.js";
import { 
    deletePhoto,
    uploadPhoto 
} from "../middlewares/uploadPhotoMiddleware.js";

import { isAuthenticated } from "../middlewares/authMiddelware.js";


const router = new Router();

router.put("/photo/:userId",isAuthenticated,uploadPhoto);
router.post("", isAuthenticated,addUser);
router.post("/bulk", isAuthenticated,addUsersBulk);
router.get("", isAuthenticated,getUsers);
router.delete("/:userId", isAuthenticated,deleteUser);
router.put("/:userId",isAuthenticated,updateUserData);
router.get("/:userId", isAuthenticated,getOneUser);
router.delete("/photo/:userId", isAuthenticated,deletePhoto);

export default router;
