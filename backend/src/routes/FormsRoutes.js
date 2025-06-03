import { Router } from "express";
import {
    getForms,
    createForm,
    deleteForm,
    editForm,
    addQuestionsToForm,
    getFormById,
    getResponses,
    getFormsByUserId,
    respondeForm,
    getQuestionsByForm,
    getUsersByFormAssign,
    deleteUsersByFormAssign,
    assignUsersToForm,
    cloneForm,
} from "../controllers/FormsController.js";
const router = new Router();

// Admin
router.get("", getForms);                           //Ver todas las encuestas    
router.post("", createForm);                          //Crea la encuesta
router.delete("/:id", deleteForm);  //Elimina la encuesta
router.put("/:id", editForm);      //Edita la encuesta
router.post("/assign/:formId", assignUsersToForm);        //trae Preguntas del form por id
router.get("/assign/:formId", getUsersByFormAssign);        //trae Preguntas del form por id
router.delete("/assign/:formId/:userId", deleteUsersByFormAssign);        //trae Preguntas del form por id
router.get("/manage/:id", getQuestionsByForm);        //trae Preguntas del form por id
router.post("/manage/:id", addQuestionsToForm);  //Anade o edita preguntas
router.get("/:id", getFormById);  //Trae la info de la encuesta por id 
router.post("/clone/:formId", cloneForm);                         







router.get("/user/:userId", getFormsByUserId);      
router.get("/responses/:id", getResponses);         
router.post("/submit/:id", respondeForm);           

export default router;
