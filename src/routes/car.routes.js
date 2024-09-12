import { Router } from "express";
import carController from "../controllers/car.controller.js";

const carRouter = Router();

carRouter
  .get("/", carController.getAllCars)
  .post("/add", carController.createCar)
  .put("/update/:carId", carController.updateCar)
  .delete("/delete/:carId", carController.deleteCar);

export default carRouter;
