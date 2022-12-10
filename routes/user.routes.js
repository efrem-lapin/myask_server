import { Router } from "express";
import userController from "../controller/user.controller.js";

const userRouter = new Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/login", userController.login);
userRouter.get("/refresh", userController.refreshToken);
userRouter.get("/logout", userController.logout);
// userRouter.get("/users", userController.getUsers);
userRouter.get("/user/:id", userController.getOneUser);
userRouter.put("/user/:id", userController.updateUser);
userRouter.delete("/user/:id", userController.deleteUser);
userRouter.post("/user/change", userController.changeUserData);

export default userRouter;
