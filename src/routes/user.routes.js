import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter
  .get("/", userController.getAllUsers)
  .post("/add", userController.createUser)
  .post("/signin", userController.signin) // Signin uchun route
  .put("/update/:userId", userController.updateUser)
  .delete("/delete/:userId", userController.deleteUser);

export default userRouter;
