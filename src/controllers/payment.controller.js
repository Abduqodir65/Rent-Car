import Payment from "../models/payment.model.js"; // Payment modelini import qilish
import Order from "../models/orders.model.js";
import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";

class PaymentController {
  // Get all payments
  getAllPayments = async (req, res, next) => {
    try {
      const query = { ...req.query };

      const allPaymentsCount = await Payment.countDocuments(query);

      const allPayments = await Payment.find(query)
        .populate("order_id", "start_time finish_time") // order_id bilan buyurtma ma'lumotlarini populate qilish
        .populate("customer_id", "name") // customer_id bilan mijoz ismini populate qilish
        .populate("wallet_id", "balance") // wallet_id bilan hamyon balansini populate qilish
        .sort("payment_date");

      res.send({
        message: "success",
        results: allPaymentsCount,
        data: allPayments,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new payment
  createPayment = async (req, res, next) => {
    try {
      const { order_id, customer_id, wallet_id, payment_date } = req.body;

      // Tekshirish uchun order, customer va wallet mavjudligini tasdiqlash
      const order = await Order.findById(order_id);
      if (!order) {
        throw new BadRequestException("Order not found");
      }

      const customer = await User.findById(customer_id);
      if (!customer) {
        throw new BadRequestException("Customer not found");
      }

      const wallet = await Wallet.findById(wallet_id);
      if (!wallet) {
        throw new BadRequestException("Wallet not found");
      }

      const newPayment = new Payment({
        order_id,
        customer_id,
        wallet_id,
        payment_date,
      });

      await newPayment.save();

      res.status(201).send({ message: "Payment created successfully", payment: newPayment });
    } catch (error) {
      next(error);
    }
  };

  // Update a payment
  updatePayment = async (req, res, next) => {
    try {
      const { paymentId } = req.params;
      const { order_id, customer_id, wallet_id, payment_date } = req.body;

      // Check if the paymentId is valid
      if (!isValidObjectId(paymentId)) {
        throw new BadRequestException(`Given ${paymentId} is not a valid ObjectID`);
      }

      const updatedData = {
        order_id,
        customer_id,
        wallet_id,
        payment_date,
      };

      const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updatedData, { new: true });

      // Check if the payment was found and updated
      if (!updatedPayment) {
        throw new NotFoundException("Payment not found");
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Delete a payment
  deletePayment = async (req, res, next) => {
    try {
      const { paymentId } = req.params;

      // Check if the paymentId is valid
      if (!isValidObjectId(paymentId)) {
        throw new BadRequestException(`Given ${paymentId} is not a valid ObjectID`);
      }

      const deletedPayment = await Payment.findByIdAndDelete(paymentId);

      // Check if the payment was found and deleted
      if (!deletedPayment) {
        throw new NotFoundException("Payment not found");
      }

      res.send({ message: "Payment deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default new PaymentController();
