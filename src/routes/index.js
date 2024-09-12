import { Router } from "express";
import userRouter from "./user.routes.js";
import carRouter from "./car.routes.js";
import orderRouter from "./orders.routes.js";
import paymentRouter from "./payment.routes.js";
import walletRouter from "./wallet.routes.js";
import adminRouter from "./admin.routes.js";

const routes = Router();

routes.use("/users", userRouter);
routes.use("/cars", carRouter);
routes.use("/orders", orderRouter);
routes.use("/payments", paymentRouter);
routes.use("/wallets", walletRouter);
routes.use("/admins", adminRouter);

export default routes;
