import { Router } from "express";
import userController from "../controller/user.controller.js";

const userRouter = new Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/login", userController.login);
userRouter.get("/refresh", userController.refreshToken);
userRouter.get("/logout", userController.logout);
// userRouter.get("/users", userController.getUsers);
userRouter.get("/user/:id", userController.getOneUser);
userRouter.delete("/user/:id", userController.deleteUser);
userRouter.put("/user/update", userController.updateUser);
userRouter.put("/user/status", userController.updateStatus);

export default userRouter;
