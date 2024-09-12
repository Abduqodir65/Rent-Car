import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter
  .get("/", paymentController.getAllPayments)
  .post("/add", paymentController.createPayment)
  .put("/update/:paymentId", paymentController.updatePayment)
  .delete("/delete/:paymentId", paymentController.deletePayment);

export default paymentRouter;
