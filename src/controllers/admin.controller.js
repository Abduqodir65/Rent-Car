import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../models/admin.model.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ConflictException } from "../exceptions/conflic.exception.js";
import bcryptConfig from "../config/bcrypt.config.js";

class AdminController {
  #_adminModel;

  constructor() {
    this.#_adminModel = Admin;
  }

  // Get all admins
  getAllAdmins = async (req, res, next) => {
    try {
      const query = { ...req.query };

      const allAdminsCount = await this.#_adminModel.countDocuments(query);

      const allAdmins = await this.#_adminModel.find(query)
        .sort("name")
        .select("-hashed_password");

      res.send({
        message: "success",
        results: allAdminsCount,
        data: allAdmins,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new admin
  createAdmin = async (req, res, next) => {
    try {
      const { name, email, phone_number, password } = req.body;

      // Check if the admin already exists
      const existingAdmin = await this.#_adminModel.findOne({ email });
      if (existingAdmin) {
        throw new ConflictException("Admin with this email already exists.");
      }

      const hashed_password = await bcrypt.hash(password, bcryptConfig.rounds);

      await this.#_adminModel.create({
        name,
        email,
        phone_number,
        hashed_password,
      });

      res.status(201).send({ message: "Admin created successfully" });
    } catch (error) {
      next(error);
    }
  };

  // Update an admin
  updateAdmin = async (req, res, next) => {
    try {
      const { adminId } = req.params;
      const { name, email, phone_number, password } = req.body;

      this.#_checkObjectId(adminId);

      let hashed_password;
      if (password) {
        hashed_password = await bcrypt.hash(password, bcryptConfig.rounds);
      }

      const updatedData = {
        name,
        email,
        phone_number,
        ...(password && { hashed_password }),
      };

      await this.#_adminModel.findByIdAndUpdate(adminId, updatedData);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Delete an admin
  deleteAdmin = async (req, res, next) => {
    try {
      const { adminId } = req.params;

      this.#_checkObjectId(adminId);

      await this.#_adminModel.findByIdAndDelete(adminId);

      res.send({ message: "Admin deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  #_checkObjectId = (id) => {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Given ${id} is not a valid ObjectID`);
    }
  };
}

export default new AdminController();
