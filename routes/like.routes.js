import { Router } from "express";
import likeController from "../controller/like.controller.js";

const likeRouter = new Router();

likeRouter.post("/putlike", likeController.putLike);
likeRouter.get("/getlikes/:questionId", likeController.getIdAllLikesAnswer);

export default likeRouter;