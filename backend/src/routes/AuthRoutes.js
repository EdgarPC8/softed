import { Router } from "express";
import { login, renoveLicense, verifytoken,getLicenses,addLicense, deleteLicense, updateLicense, getOneLicense } from "../controllers/AuthController.js";


const router = Router();

router.post("/login", login);
router.get("/getSession", verifytoken);
router.get("/getLicenses", getLicenses);
router.post("/renoveLicense", renoveLicense);
router.post("/addLicense", addLicense);

router.delete("/license/:id", deleteLicense);
router.put("/license/:id",updateLicense);
router.get("/license/:id", getOneLicense);

export default router;
