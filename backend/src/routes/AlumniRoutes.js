import { Router } from "express";
import { getMatriz,addMatriz,editMatriz,deleteMatriz } from "../controllers/Alumni/MatrizController.js";
import { getCareers,addCareer,editCareer,deleteCareer } from "../controllers/Alumni/CareerController.js";
import { getPeriods,addPeriod,editPeriod ,deletePeriod} from "../controllers/Alumni/PeriodController.js";
const router = new Router();

router.get("/matriz", getMatriz);                             
router.post("/matriz", addMatriz);                             
router.put("/matriz/:id", editMatriz);                             
router.delete("/matriz/:id", deleteMatriz);                             
router.get("/career", getCareers);                             
router.post("/career", addCareer);                             
router.put("/career/:id", editCareer);                             
router.delete("/career/:id", deleteCareer);                             
router.get("/period", getPeriods);                             
router.post("/period", addPeriod);                             
router.put("/period/:id", editPeriod);                             
router.delete("/period/:id", deletePeriod);    




export default router;
