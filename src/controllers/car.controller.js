import Car from "../models/car.model.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ConflictException } from "../exceptions/conflic.exception.js";
import {upload} from "../utils/multer.utils.js"

class CarController {
  getAllCars = async (req, res, next) => {
    try {
      const query = { ...req.query };
      const allCarsCount = await Car.countDocuments(query);
      const allCars = await Car.find(query).sort("model");

      res.send({
        message: "success",
        results: allCarsCount,
        data: allCars,
      });
    } catch (error) {
      next(error);
    }
  };

  createCar = async (req, res, next) => {
    try {
      upload.single("car_image")(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ error: err.message });
        }

        const { model, price_daily, color, fuel_type, status } = req.body;

        if (!req.file) {
          throw new BadRequestException("Car image is required");
        }
        const existingCar = await Car.findOne({ model, color, fuel_type });
        if (existingCar) {
          throw new ConflictException("Car with the same details already exists");
        }

        const newCar = new Car({
          model,
          price_daily,
          color,
          fuel_type,
          status,
          car_image: req.file.path,  
        });

        await newCar.save();

        res.status(201).send({ message: "Car created successfully", car: newCar });
      });
    } catch (error) {
      next(error);
    }
  };


  updateCar = async (req, res, next) => {
    try {
      const { carId } = req.params;
      const { model, price_daily, color, fuel_type, status } = req.body;

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
      
      if (!updatedCar) {
        throw new NotFoundException("Car not found");
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  deleteCar = async (req, res, next) => {
    try {
      const { carId } = req.params;

      if (!isValidObjectId(carId)) {
        throw new BadRequestException(`Given ${carId} is not a valid ObjectID`);
      }

      const deletedCar = await Car.findByIdAndDelete(carId);

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
