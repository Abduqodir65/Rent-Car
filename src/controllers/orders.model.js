import Order from "../models/orders.model.js"; // Order modelini import qilish
import Car from "../models/car.model.js";
import Customer from "../models/customer.model.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { ConflictException } from "../exceptions/conflic.exception.js";

class OrderController {
  // Get all orders
  getAllOrders = async (req, res, next) => {
    try {
      const query = { ...req.query };

      const allOrdersCount = await Order.countDocuments(query);

      const allOrders = await Order.find(query)
        .populate("car_id", "model") // car_id bilan car modelini populate qilish
        .populate("customer_id", "name") // customer_id bilan customer ismini populate qilish
        .sort("start_time");

      res.send({
        message: "success",
        results: allOrdersCount,
        data: allOrders,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new order
  createOrder = async (req, res, next) => {
    try {
      const { car_id, customer_id, start_time, finish_time, total_amount } = req.body;

      // Tekshirish uchun car va customer mavjudligini tasdiqlash
      const car = await Car.findById(car_id);
      if (!car) {
        throw new BadRequestException("Car not found");
      }

      const customer = await Customer.findById(customer_id);
      if (!customer) {
        throw new BadRequestException("Customer not found");
      }

      // Create a new order
      const newOrder = new Order({
        car_id,
        customer_id,
        start_time,
        finish_time,
        total_amount,
      });

      await newOrder.save();

      res.status(201).send({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      next(error);
    }
  };

  // Update an order
  updateOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { car_id, customer_id, start_time, finish_time, total_amount } = req.body;

      // Check if the orderId is valid
      if (!isValidObjectId(orderId)) {
        throw new BadRequestException(`Given ${orderId} is not a valid ObjectID`);
      }

      const updatedData = {
        car_id,
        customer_id,
        start_time,
        finish_time,
        total_amount,
      };

      const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedData, { new: true });

      // Check if the order was found and updated
      if (!updatedOrder) {
        throw new NotFoundException("Order not found");
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Delete an order
  deleteOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;

      // Check if the orderId is valid
      if (!isValidObjectId(orderId)) {
        throw new BadRequestException(`Given ${orderId} is not a valid ObjectID`);
      }

      const deletedOrder = await Order.findByIdAndDelete(orderId);

      // Check if the order was found and deleted
      if (!deletedOrder) {
        throw new NotFoundException("Order not found");
      }

      res.send({ message: "Order deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
