import Car from "../models/car.model.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ConflictException } from "../exceptions/conflic.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";

class CarController {
  // Get all cars
  getAllCars = async (req, res, next) => {
    try {
      const query = { ...req.query };

      const allCarsCount = await Car.countDocuments(query);

      const allCars = await Car.find(query)
        .sort("model");

      res.send({
        message: "success",
        results: allCarsCount,
        data: allCars,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new car
  createCar = async (req, res, next) => {
    try {
      const { model, price_daily, color, fuel_type, status } = req.body;

      // Check if the car already exists
      const existingCar = await Car.findOne({ model, color, fuel_type });
      if (existingCar) {
        throw new ConflictException("Car with the same details already exists");
      }

      // Create a new car
      const newCar = new Car({
        model,
        price_daily,
        color,
        fuel_type,
        status,
      });

      await newCar.save();

      res.status(201).send({ message: "Car created successfully", car: newCar });
    } catch (error) {
      next(error);
    }
  };

  // Update a car
  updateCar = async (req, res, next) => {
    try {
      const { carId } = req.params;
      const { model, price_daily, color, fuel_type, status } = req.body;

      // Check if the carId is valid
      if (!isValidObjectId(carId)) {
        throw new BadRequestException(`Given ${carId} is not a valid ObjectID`);
      }

      const updatedData = {
        model,
        price_daily,
        color,
        fuel_type,
        status,
      };

      const updatedCar = await Car.findByIdAndUpdate(carId, updatedData, { new: true });
      
      // Check if the car was found and updated
      if (!updatedCar) {
        throw new NotFoundException("Car not found");
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Delete a car
  deleteCar = async (req, res, next) => {
    try {
      const { carId } = req.params;

      // Check if the carId is valid
      if (!isValidObjectId(carId)) {
        throw new BadRequestException(`Given ${carId} is not a valid ObjectID`);
      }

      const deletedCar = await Car.findByIdAndDelete(carId);

      // Check if the car was found and deleted
      if (!deletedCar) {
        throw new NotFoundException("Car not found");
      }

      res.send({ message: "Car deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default new CarController();
