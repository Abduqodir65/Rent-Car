import { Router } from "express";
import userRouter from "./user.routes.js";
import carRouter from './car.routes.js'

const routes = Router();

routes.use("/users", userRouter);
routes.use('/cars',carRouter)

export default routes
