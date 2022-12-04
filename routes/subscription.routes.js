import { Router } from "express";
import SubscriptionController from "../controller/subscription.controller.js";

const subscriptionRouter = new Router();

subscriptionRouter.post("/subscribe", SubscriptionController.subscribe);

export default subscriptionRouter;