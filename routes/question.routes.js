import { Router } from "express";
import questionController from "../controller/question.controller.js";

const questionRouter = new Router();

// questionRouter.get("/questions")
questionRouter.post("/ask", questionController.postQuestion)
questionRouter.get("/questions:id", questionController.getUnansweredQuestion)

export default questionRouter;