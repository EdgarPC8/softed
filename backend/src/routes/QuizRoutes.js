import { Router } from "express";
import {
    getQuizzes,
    saveQuiz,
    getOptionsQuestions,
    updateAnswerUser,
    addAnswerUser,
    addAllAnswersUsers,
} from "../controllers/QuizController.js";
import { isAuthenticated } from "../middlewares/authMiddelware.js";


const router = new Router();

router.get("", isAuthenticated,getQuizzes);
router.post("", isAuthenticated,saveQuiz);
router.get("/getOptionsQuestions", isAuthenticated,getOptionsQuestions);
router.put("/answer/:idQuestion/:idOption",isAuthenticated,updateAnswerUser);
router.post("/answer", isAuthenticated,addAnswerUser);
router.post("/addAllAnswersUsers", isAuthenticated,addAllAnswersUsers);

// router.put("/photo/:userId",uploadPhoto);
// router.delete("/:userId", deleteUser);
// router.put("/:userId",updateUserData);
// router.get("/:userId", getOneUser);
// router.delete("/photo/:userId", deletePhoto);

export default router;
