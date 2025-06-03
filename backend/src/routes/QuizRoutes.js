import { Router } from "express";
import {
    getQuizzes,
    saveQuiz,
    getOptionsQuestions,
    updateAnswerUser,
    addAnswerUser,
    addAllAnswersUsers,
} from "../controllers/QuizController.js";

const router = new Router();

router.get("", getQuizzes);
router.post("", saveQuiz);
router.get("/getOptionsQuestions", getOptionsQuestions);
router.put("/answer/:idQuestion/:idOption",updateAnswerUser);
router.post("/answer", addAnswerUser);
router.post("/addAllAnswersUsers", addAllAnswersUsers);

// router.put("/photo/:userId",uploadPhoto);
// router.delete("/:userId", deleteUser);
// router.put("/:userId",updateUserData);
// router.get("/:userId", getOneUser);
// router.delete("/photo/:userId", deletePhoto);

export default router;
