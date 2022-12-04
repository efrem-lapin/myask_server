import { Router } from "express";
import questionController from "../controller/question.controller.js";

const questionRouter = new Router();

questionRouter.post("/ask", questionController.setQuestion);
questionRouter.get("/questions/:id", questionController.getUnansweredQuestion);
questionRouter.post("/answer", questionController.setAnswer);
questionRouter.get("/answers/:id", questionController.getAnswers);
questionRouter.get("/last", questionController.getLastAnswers);
questionRouter.post("/remove", questionController.removeQuestion);

export default questionRouter;
