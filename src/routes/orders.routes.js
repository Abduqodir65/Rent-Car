import { Router } from "express";
import orderController from "../controllers/orders.controller.js";

const orderRouter = Router();

orderRouter
  .get("/", orderController.getAllOrders)
  .post("/add", orderController.createOrder)
  .put("/update/:orderId", orderController.updateOrder)
  .delete("/delete/:orderId", orderController.deleteOrder);

export default orderRouter;
