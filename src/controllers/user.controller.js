import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiFeature from "../utils/api-feature.utils.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import bcryptConfig from "../config/bcrypt.config.js";
import { ConflictException } from "../exceptions/conflic.exception.js";

class UserController {
  #_userModel;

  constructor() {
    this.#_userModel = User;
  }

  // Get all users with filtering, sorting, and pagination
  getAllUsers = async (req, res, next) => {
    try {
      const query = { ...req.query };

      // GET ALL FILTERED USERS COUNT
      const allResultsCount = await new ApiFeature(
        this.#_userModel.find(),
        query
      )
        .filter()
        .sort("birthDate")
        .limitFields()
        .getQuery()
        .countDocuments();

      // EXECUTE QUERY
      const allFilteredUsers = await new ApiFeature(
        this.#_userModel.find(),
        query
      )
        .filter()
        .sort("birthDate")
        .limitFields()
        .paginate()
        .getQuery()
        .populate("groups")
        .select("-hashed_password"); // Change to match your field

      res.send({
        message: "success",
        page: req.query?.page || 0,
        limit: req.query?.limit || 10,
        results: allResultsCount,
        data: allFilteredUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new user
  createUser = async (req, res, next) => {
    try {
      if (req.role === "admin") {
        if (req.body.role === "admin" || req.body.role === "super-admin") {
          throw new ConflictException(
            "You are not allowed to create admin or super-admin users"
          );
        }
      }
      
      const hashedPass = await bcrypt.hash(req.body.hashed_password, bcryptConfig.rounds);

      await this.#_userModel.create({
        ...req.body,
        hashed_password: hashedPass,
      });

      res.status(201).send({
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Update a user by ID
  updateUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { full_name, phone_number, email, hashed_password, address } = req.body;

      let newPasswordHash = undefined;

      if (hashed_password) {
        newPasswordHash = await bcrypt.hash(hashed_password, bcryptConfig.rounds);
      }

      // Check if userId is valid
      this.#_checkObjectId(userId);

      await this.#_userModel.findByIdAndUpdate(userId, {
        full_name,
        phone_number,
        email,
        hashed_password: newPasswordHash,
        address,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Delete a user by ID
  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;

      // Check if userId is valid
      this.#_checkObjectId(userId);

      await this.#_userModel.findByIdAndDelete(userId);

      res.send({
        message: "User successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  };

  // Private method to check if ObjectId is valid
  #_checkObjectId = (id) => {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Given ${id} is not a valid ObjectID`);
    }
  };
}

export default new UserController();
