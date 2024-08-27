import { isValidObjectId } from "mongoose";
import { Car } from "../models/car.model.js";

class CarController {
  constructor() {}

  async getAllCars(req, res) {
    const allCars = await Car.find();

    res.send({
      message: "Success",
      results: allCars.length,
      data: allCars,
    });
  }

  async createCar(req, res) {
    const { brand, model, vehicles_count, price } = req.body;

    const newCar = new Car({
      brand:brand, 
      model: model,
      vehicles_count: vehicles_count,
      price: price,
    });

    await newCar.save();

    res.status(201).send({
      message: "success",
      data: newCar,
    });
  }

  async updateCar(req, res) {
    const {brand, model, vehicles_count, price, ...rest } = req.body;

    const CarId = req.params?.CarId;

    if (!isValidObjectId(CarId)) {
      return res.status(404).send({
        message: "Iltimos Object ID jo'nating",
      });
    }

    const foundedCar = await Car.findById(CarId);

    if (!foundedCar) {
      return res.status(404).send({
        message: "User topilmadi",
      });
    }


    await Car.updateOne(
      { _id: CarId },
      {
        $set: {
          brand:brand, 
          model: model,
          vehicles_count: vehicles_count,
          price: price,
          ...rest,
        },
      }
    );
    res.status(200).send({
      message: "success",
    });
  }

  async deleteCar(req, res) {
    const CarId = req.params?.CarId;
  
    if (!isValidObjectId(CarId)) {
      return res.status(404).send({
        message: "Iltimos Object ID jonating",
      });
    }
  
    const foundedCar = await Car.findById(CarId);  
  
    if (!foundedCar) {
      return res.status(404).send({
        message: "User topilmadi",
      });
    }
  
    await Car.deleteOne({ _id: CarId });
  
    res.status(200).send({
      message: "success",
    });
  }
}

export default new CarController();
